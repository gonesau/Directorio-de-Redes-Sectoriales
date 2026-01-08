/**
 * DIRECTORIO DE REDES SECTORIALES - PROYECTO MESOAMÉRICA
 * =========================================================
 * Sistema optimizado de gestión de directorio sin base de datos
 */

// ===========================================
// CONFIGURACIÓN GLOBAL
// ===========================================
const CONFIG = {
    ITEMS_PER_PAGE: 9,
    DEBOUNCE_DELAY: 300,
    TOAST_DURATION: 3000,
    MAX_PAGINATION_BUTTONS: 7,
    MICROSOFT_FORM_URL: 'https://forms.office.com/r/6hQnhAduHd' 
};

// ===========================================
// ESTADO DE LA APLICACIÓN
// ===========================================
const AppState = {
    currentPage: 1,
    currentSector: 'all',
    currentSort: 'name-asc',
    currentView: 'list',
    filteredMembers: [],
    searchTerm: ''
};

// ===========================================
// ELEMENTOS DEL DOM
// ===========================================
const DOM = {
    membersList: document.getElementById('members-list'),
    sectors: document.getElementById('sectors'),
    searchInput: document.getElementById('searchInput'),
    clearSearch: document.getElementById('clearSearch'),
    sortSelect: document.getElementById('sortSelect'),
    paginationContainer: document.getElementById('paginationContainer'),
    resultsCount: document.getElementById('resultsCount'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    noResults: document.getElementById('noResults'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage'),
    viewGrid: document.getElementById('viewGrid'),
    viewList: document.getElementById('viewList'),
    totalMembers: document.getElementById('totalMembers'),
    totalCountries: document.getElementById('totalCountries')
};

// ===========================================
// UTILIDADES
// ===========================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function normalizeText(text) {
    return text.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function toggleElement(element, show) {
    if (element) {
        element.style.display = show ? 'block' : 'none';
    }
}

function showToast(message, duration = CONFIG.TOAST_DURATION) {
    DOM.toastMessage.textContent = message;
    DOM.toast.style.display = 'block';
    DOM.toast.classList.add('show');
    
    setTimeout(() => {
        DOM.toast.classList.remove('show');
        setTimeout(() => {
            DOM.toast.style.display = 'none';
        }, 300);
    }, duration);
}

async function registrarEvento(accion, detalle) {
    try {
        const response = await fetch('guardar_registro_directorio.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accion, detalle, timestamp: new Date().toISOString() })
        });
        const data = await response.json();
        console.log('Evento registrado:', data);
    } catch (error) {
        console.error('Error al registrar evento:', error);
    }
}

// ===========================================
// FUNCIONES DE FILTRADO Y ORDENAMIENTO
// ===========================================

function filterMembers() {
    let filtered = [...members];
    
    // Filtrar por sector
    if (AppState.currentSector !== 'all') {
        filtered = filtered.filter(member => 
            member.sector.includes(AppState.currentSector)
        );
    }
    
    // Filtrar por búsqueda
    if (AppState.searchTerm) {
        const normalizedSearch = normalizeText(AppState.searchTerm);
        filtered = filtered.filter(member => {
            const nameMatch = normalizeText(member.nombre).includes(normalizedSearch);
            const institutionMatch = normalizeText(member.institucion).includes(normalizedSearch);
            const positionMatch = normalizeText(member.cargo).includes(normalizedSearch);
            const emailMatch = normalizeText(member.correo).includes(normalizedSearch);
            const countryMatch = normalizeText(member.pais).includes(normalizedSearch);
            return nameMatch || institutionMatch || positionMatch || emailMatch || countryMatch;
        });
    }
    
    // Ordenar
    filtered = sortMembers(filtered, AppState.currentSort);
    
    return filtered;
}

function sortMembers(membersArray, sortType) {
    const sorted = [...membersArray];
    
    switch(sortType) {
        case 'name-asc':
            return sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
        case 'name-desc':
            return sorted.sort((a, b) => b.nombre.localeCompare(a.nombre));
        case 'country-asc':
            return sorted.sort((a, b) => a.pais.localeCompare(b.pais));
        case 'institution-asc':
            return sorted.sort((a, b) => a.institucion.localeCompare(b.institucion));
        default:
            return sorted;
    }
}

// ===========================================
// RENDERIZADO DE MIEMBROS
// ===========================================

function generateMemberHTML(member) {
    const sectorBadges = member.sector.map(sect => 
        `<span class="badge badge-primary">
            <i class="fas ${getSectorIcon(sect)}"></i> ${sect}
        </span>`
    ).join('');
    
    const whatsappBtn = member.whatsapp ? 
        `<a href="https://wa.me/${member.whatsapp.replace(/[^0-9]/g, '')}" 
            target="_blank" 
            class="btn btn-success btn-sm"
            onclick="registrarEvento('WhatsApp', '${member.nombre}')">
            <i class="fab fa-whatsapp"></i> WhatsApp
        </a>` : '';
    
    if (AppState.currentView === 'grid') {
        return `
            <div class="member-card">
                <div class="member-photo-container">
                    <img src="${member.foto}" alt="${member.nombre}" class="member-photo" loading="lazy">
                </div>
                <div class="member-info">
                    <h5 class="member-name">${member.nombre}</h5>
                    <p class="member-position">${member.cargo}</p>
                    <p class="member-institution">${member.institucion}</p>
                    <span class="member-country">
                        <i class="fas fa-map-marker-alt"></i> ${member.pais}
                    </span>
                    <div class="member-sectors">${sectorBadges}</div>
                    <div class="member-contact">
                        <div class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <span>${member.correo}</span>
                        </div>
                        ${member.telefono ? `
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <span>${member.telefono}</span>
                        </div>` : ''}
                    </div>
                    <div class="member-actions">
                        <button class="btn btn-info btn-sm" 
                                onclick="showMemberDetail('${member.id}')">
                            <i class="fas fa-eye"></i> Ver Detalle
                        </button>
                        <a href="mailto:${member.correo}" 
                           class="btn btn-primary btn-sm"
                           onclick="registrarEvento('Enviar Correo', '${member.nombre}')">
                            <i class="fas fa-envelope"></i> Enviar Correo
                        </a>
                        ${whatsappBtn}
                        <button class="btn btn-secondary btn-sm" 
                                onclick="shareContact('${member.id}')">
                            <i class="fas fa-share-alt"></i> Compartir
                        </button>
                    </div>
                </div>
            </div>
        `;
    } else {
        return `
            <div class="member-card">
                <div class="member-photo-container">
                    <img src="${member.foto}" alt="${member.nombre}" class="member-photo" loading="lazy">
                </div>
                <div class="member-info">
                    <h5 class="member-name">${member.nombre}</h5>
                    <p class="member-position">${member.cargo}</p>
                    <p class="member-institution">${member.institucion}</p>
                    <span class="member-country">
                        <i class="fas fa-map-marker-alt"></i> ${member.pais}
                    </span>
                    <div class="member-sectors">${sectorBadges}</div>
                    <div class="member-contact">
                        <div class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <span>${member.correo}</span>
                        </div>
                        ${member.telefono ? `
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <span>${member.telefono}</span>
                        </div>` : ''}
                    </div>
                    <div class="member-details">
                        <div class="detail-section">
                            <div class="detail-label">Áreas de Interés:</div>
                            <div class="detail-content">${member.areas_interes}</div>
                        </div>
                        <div class="detail-section">
                            <div class="detail-label">Temas de Apoyo:</div>
                            <div class="detail-content">${member.temas_apoyo}</div>
                        </div>
                    </div>
                    <div class="member-actions">
                        <button class="btn btn-info btn-sm" 
                                onclick="showMemberDetail('${member.id}')">
                            <i class="fas fa-eye"></i> Ver Detalle Completo
                        </button>
                        <a href="mailto:${member.correo}" 
                           class="btn btn-primary btn-sm"
                           onclick="registrarEvento('Enviar Correo', '${member.nombre}')">
                            <i class="fas fa-envelope"></i> Enviar Correo
                        </a>
                        ${whatsappBtn}
                        <button class="btn btn-secondary btn-sm" 
                                onclick="shareContact('${member.id}')">
                            <i class="fas fa-share-alt"></i> Compartir
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

function getSectorIcon(sector) {
    const icons = {
        'Energía': 'fa-bolt',
        'Transformación Digital': 'fa-laptop-code',
        'Transporte': 'fa-truck',
        'Facilitación del Comercio': 'fa-handshake'
    };
    return icons[sector] || 'fa-circle';
}

// ===========================================
// PAGINACIÓN
// ===========================================

function createPaginationButtons() {
    const totalPages = Math.ceil(AppState.filteredMembers.length / CONFIG.ITEMS_PER_PAGE);
    DOM.paginationContainer.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    const nav = document.createElement('nav');
    const ul = document.createElement('ul');
    ul.className = 'pagination justify-content-center';
    
    ul.appendChild(createPageButton('Anterior', AppState.currentPage - 1, AppState.currentPage === 1));
    
    const pageNumbers = getPageNumbers(AppState.currentPage, totalPages);
    pageNumbers.forEach(pageNum => {
        if (pageNum === '...') {
            const li = document.createElement('li');
            li.className = 'page-item disabled';
            li.innerHTML = '<span class="page-link">...</span>';
            ul.appendChild(li);
        } else {
            ul.appendChild(createPageButton(pageNum, pageNum, false, pageNum === AppState.currentPage));
        }
    });
    
    ul.appendChild(createPageButton('Siguiente', AppState.currentPage + 1, AppState.currentPage === totalPages));
    
    nav.appendChild(ul);
    DOM.paginationContainer.appendChild(nav);
}

function createPageButton(text, pageNum, disabled, active = false) {
    const li = document.createElement('li');
    li.className = `page-item ${disabled ? 'disabled' : ''} ${active ? 'active' : ''}`;
    
    const button = document.createElement('button');
    button.className = 'page-link';
    button.textContent = text;
    button.disabled = disabled;
    
    if (!disabled) {
        button.addEventListener('click', () => {
            AppState.currentPage = pageNum;
            displayMembers();
            scrollToTop();
        });
    }
    
    li.appendChild(button);
    return li;
}

function getPageNumbers(current, total) {
    const max = CONFIG.MAX_PAGINATION_BUTTONS;
    const pages = [];
    
    if (total <= max) {
        for (let i = 1; i <= total; i++) pages.push(i);
        return pages;
    }
    
    pages.push(1);
    
    let start = Math.max(2, current - 2);
    let end = Math.min(total - 1, current + 2);
    
    if (current <= 3) {
        start = 2;
        end = max - 1;
    } else if (current >= total - 2) {
        start = total - (max - 2);
        end = total - 1;
    }
    
    if (start > 2) pages.push('...');
    
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    
    if (end < total - 1) pages.push('...');
    
    pages.push(total);
    
    return pages;
}

function scrollToTop() {
    DOM.membersList.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===========================================
// MOSTRAR MIEMBROS
// ===========================================

function displayMembers() {
    toggleElement(DOM.loadingSpinner, true);
    toggleElement(DOM.membersList, false);
    toggleElement(DOM.noResults, false);
    
    setTimeout(() => {
        DOM.membersList.innerHTML = '';
        
        const startIndex = (AppState.currentPage - 1) * CONFIG.ITEMS_PER_PAGE;
        const endIndex = startIndex + CONFIG.ITEMS_PER_PAGE;
        const pageMembers = AppState.filteredMembers.slice(startIndex, endIndex);
        
        pageMembers.forEach(member => {
            DOM.membersList.innerHTML += generateMemberHTML(member);
        });
        
        updateResultsCount();
        createPaginationButtons();
        
        toggleElement(DOM.loadingSpinner, false);
        toggleElement(DOM.membersList, pageMembers.length > 0);
        toggleElement(DOM.noResults, pageMembers.length === 0);
    }, 150);
}

function updateResultsCount() {
    const total = AppState.filteredMembers.length;
    const start = total > 0 ? (AppState.currentPage - 1) * CONFIG.ITEMS_PER_PAGE + 1 : 0;
    const end = Math.min(AppState.currentPage * CONFIG.ITEMS_PER_PAGE, total);
    
    DOM.resultsCount.innerHTML = `
        <i class="fas fa-users"></i> 
        Mostrando <strong>${start}-${end}</strong> de <strong>${total}</strong> miembros
    `;
}

function updateSectorCounts() {
    document.getElementById('count-all').textContent = members.length;
    
    const counts = {
        'Energía': 0,
        'Transformación Digital': 0,
        'Transporte': 0,
        'Facilitación del Comercio': 0
    };
    
    members.forEach(member => {
        member.sector.forEach(sect => {
            if (counts.hasOwnProperty(sect)) {
                counts[sect]++;
            }
        });
    });
    
    Object.keys(counts).forEach(sect => {
        const countElement = document.getElementById(`count-${sect}`);
        if (countElement) {
            countElement.textContent = counts[sect];
        }
    });
}

function updateStatistics() {
    DOM.totalMembers.textContent = members.length;
    const uniqueCountries = getUniqueCountries();
    DOM.totalCountries.textContent = uniqueCountries.length;
}

// ===========================================
// FUNCIONES DE INTERACCIÓN
// ===========================================

function showMembers(sector) {
    AppState.currentSector = sector;
    AppState.currentPage = 1;
    AppState.filteredMembers = filterMembers();
    displayMembers();
}

function showMemberDetail(memberId) {
    const member = members.find(m => m.id === memberId);
    if (!member) return;
    
    const modalBody = document.getElementById('modalMemberBody');
    const modalTitle = document.getElementById('modalMemberName');
    
    modalTitle.textContent = member.nombre;
    
    const sectorBadges = member.sector.map(sect => 
        `<span class="badge badge-primary mr-1 mb-1">
            <i class="fas ${getSectorIcon(sect)}"></i> ${sect}
        </span>`
    ).join('');
    
    const whatsappBtn = member.whatsapp ? 
        `<a href="https://wa.me/${member.whatsapp.replace(/[^0-9]/g, '')}" 
            target="_blank" 
            class="btn btn-success"
            onclick="registrarEvento('WhatsApp Modal', '${member.nombre}')">
            <i class="fab fa-whatsapp"></i> Contactar por WhatsApp
        </a>` : '';
    
    modalBody.innerHTML = `
        <div class="modal-member-detail">
            <div class="modal-photo-section">
                <img src="${member.foto}" alt="${member.nombre}" class="modal-member-photo">
            </div>
            
            <div class="modal-info-grid">
                <div class="modal-info-item">
                    <div class="modal-info-label">Cargo</div>
                    <div class="modal-info-value">${member.cargo}</div>
                </div>
                
                <div class="modal-info-item">
                    <div class="modal-info-label">Institución</div>
                    <div class="modal-info-value">${member.institucion}</div>
                </div>
                
                <div class="modal-info-item">
                    <div class="modal-info-label">País</div>
                    <div class="modal-info-value">
                        <i class="fas fa-map-marker-alt text-primary"></i> ${member.pais}
                    </div>
                </div>
                
                <div class="modal-info-item">
                    <div class="modal-info-label">Correo Electrónico</div>
                    <div class="modal-info-value">
                        <a href="mailto:${member.correo}">${member.correo}</a>
                    </div>
                </div>
                
                ${member.telefono ? `
                <div class="modal-info-item">
                    <div class="modal-info-label">Teléfono</div>
                    <div class="modal-info-value">${member.telefono}</div>
                </div>` : ''}
                
                ${member.whatsapp ? `
                <div class="modal-info-item">
                    <div class="modal-info-label">WhatsApp</div>
                    <div class="modal-info-value">${member.whatsapp}</div>
                </div>` : ''}
            </div>
            
            <div class="modal-info-item mt-3">
                <div class="modal-info-label">Sectores</div>
                <div class="modal-info-value">${sectorBadges}</div>
            </div>
            
            <div class="modal-info-item mt-3">
                <div class="modal-info-label">Áreas de Interés o Experiencia</div>
                <div class="modal-info-value">${member.areas_interes}</div>
            </div>
            
            <div class="modal-info-item mt-3">
                <div class="modal-info-label">Temas en los que Puede Apoyar</div>
                <div class="modal-info-value">${member.temas_apoyo}</div>
            </div>
            
            <div class="mt-4 text-center">
                <a href="mailto:${member.correo}" 
                   class="btn btn-primary mr-2"
                   onclick="registrarEvento('Enviar Correo Modal', '${member.nombre}')">
                    <i class="fas fa-envelope"></i> Enviar Correo
                </a>
                ${whatsappBtn}
                <button class="btn btn-secondary ml-2" 
                        onclick="shareContact('${member.id}')">
                    <i class="fas fa-share-alt"></i> Compartir Contacto
                </button>
            </div>
        </div>
    `;
    
    $('#memberModal').modal('show');
    registrarEvento('Ver Detalle Completo', member.nombre);
}

function shareContact(memberId) {
    const member = members.find(m => m.id === memberId);
    if (!member) return;
    
    const contactText = `
Contacto: ${member.nombre}
Cargo: ${member.cargo}
Institución: ${member.institucion}
País: ${member.pais}
Correo: ${member.correo}
${member.telefono ? 'Teléfono: ' + member.telefono : ''}
${member.whatsapp ? 'WhatsApp: ' + member.whatsapp : ''}
    `.trim();
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(contactText)
            .then(() => {
                showToast('¡Contacto copiado al portapapeles!');
                registrarEvento('Compartir Contacto', member.nombre);
            })
            .catch(err => {
                copyToClipboardFallback(contactText);
            });
    } else {
        copyToClipboardFallback(contactText);
    }
}

function copyToClipboardFallback(text) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast('¡Contacto copiado al portapapeles!');
}

function changeView(view) {
    AppState.currentView = view;
    
    DOM.viewGrid.classList.toggle('active', view === 'grid');
    DOM.viewList.classList.toggle('active', view === 'list');
    
    DOM.membersList.className = `members-list view-${view}`;
    
    displayMembers();
}

// ===========================================
// EVENT LISTENERS
// ===========================================

const debouncedSearch = debounce(() => {
    AppState.searchTerm = DOM.searchInput.value.trim();
    AppState.currentPage = 1;
    AppState.filteredMembers = filterMembers();
    displayMembers();
    
    toggleElement(DOM.clearSearch, AppState.searchTerm.length > 0);
}, CONFIG.DEBOUNCE_DELAY);

DOM.searchInput.addEventListener('input', debouncedSearch);

DOM.clearSearch.addEventListener('click', () => {
    DOM.searchInput.value = '';
    AppState.searchTerm = '';
    toggleElement(DOM.clearSearch, false);
    AppState.currentPage = 1;
    AppState.filteredMembers = filterMembers();
    displayMembers();
    DOM.searchInput.focus();
});

DOM.sectors.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI' || e.target.parentElement.tagName === 'LI') {
        const li = e.target.tagName === 'LI' ? e.target : e.target.parentElement;
        
        document.querySelectorAll('#sectors .list-group-item').forEach(item => {
            item.classList.remove('active');
        });
        li.classList.add('active');
        
        const sector = li.getAttribute('data-sector');
        showMembers(sector);
        registrarEvento('Filtro Sector', sector);
    }
});

DOM.sortSelect.addEventListener('change', (e) => {
    AppState.currentSort = e.target.value;
    AppState.currentPage = 1;
    AppState.filteredMembers = filterMembers();
    displayMembers();
    registrarEvento('Ordenamiento', e.target.value);
});

DOM.viewGrid.addEventListener('click', () => {
    changeView('grid');
    registrarEvento('Cambio Vista', 'Cuadrícula');
});

DOM.viewList.addEventListener('click', () => {
    changeView('list');
    registrarEvento('Cambio Vista', 'Lista');
});

$('#memberModal').on('hidden.bs.modal', function () {
    // Limpiar modal al cerrar
});

// ===========================================
// INICIALIZACIÓN
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    AppState.filteredMembers = filterMembers();
    
    updateSectorCounts();
    updateStatistics();
    
    displayMembers();
    
    console.log('✅ Directorio de Redes Sectoriales cargado correctamente');
    console.log(`👥 Total de miembros: ${members.length}`);
    console.log(`🌎 Países representados: ${getUniqueCountries().length}`);
});

// Hacer funciones globales para onclick en HTML
window.registrarEvento = registrarEvento;
window.showMemberDetail = showMemberDetail;
window.shareContact = shareContact;