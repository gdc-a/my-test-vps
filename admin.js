// =====================================================
// Gupta Dental Care - Admin JS (Cloudinary)
// =====================================================

let config = {
    cloudName: 'dnamua01d',
    uploadPreset: 'gdc-admin',
    apiKey: '',
    apiSecret: '',
    galleryTag: 'gupta_dental_gallery'
};

let selectedFiles = [];

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        if (localStorage.getItem('admin_auth') === 'true') {
            window.location.href = '../admin/';
            return;
        }
        initLogin(loginForm);
        initTheme();
        return;
    }

    loadConfig();
    initEventListeners();
    refreshGallery();
    initTheme();
});

// ==================== Auth & Login ====================

function initLogin(loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        // Base64 encoded credentials for basic security obfuscation
        const validEmailsEnc = ['Z3VwdGFkZW50YWxjYXJlMDFAZ21haWwuY29t', 'YWd1cHRhMzgxNjBAZ21haWwuY29t'];
        const passEnc = 'QWd1cHRhQCMxODQ1';
        
        if (validEmailsEnc.includes(btoa(email)) && btoa(password) === passEnc) {
            localStorage.setItem('admin_auth', 'true');
            window.location.href = '../admin/';
        } else {
            const errorMsg = document.getElementById('errorMsg');
            errorMsg.classList.remove('d-none');
            errorMsg.classList.add('animate__animated', 'animate__headShake');
        }
    });
}

// ==================== Configuration ====================

function loadConfig() {
    const saved = localStorage.getItem('cloudinary_config');
    if (saved) {
        config = JSON.parse(saved);
        document.getElementById('cloudName').value = config.cloudName || 'dnamua01d';
        document.getElementById('uploadPreset').value = config.uploadPreset || 'gdc-admin';
        document.getElementById('apiKey').value = config.apiKey || '';
        document.getElementById('apiSecret').value = config.apiSecret || '';
        document.getElementById('galleryTag').value = config.galleryTag || 'gupta_dental_gallery';
    }
}

function saveConfig(e) {
    if (e) e.preventDefault();
    config.cloudName = document.getElementById('cloudName').value.trim();
    config.uploadPreset = document.getElementById('uploadPreset').value.trim();
    config.apiKey = document.getElementById('apiKey').value.trim();
    config.apiSecret = document.getElementById('apiSecret').value.trim();
    config.galleryTag = document.getElementById('galleryTag').value.trim();

    localStorage.setItem('cloudinary_config', JSON.stringify(config));
    showNotification('Configuration saved successfully!', 'success');
    refreshGallery();
}

// ==================== Event Listeners ====================

function initEventListeners() {
    const configForm = document.getElementById('cloudinaryConfigForm');
    if (configForm) configForm.addEventListener('submit', saveConfig);

    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }

    const dropZone = document.getElementById('dropZone');
    if (dropZone) {
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = 'var(--text-main)';
        });
        dropZone.addEventListener('dragleave', () => {
            dropZone.style.borderColor = 'var(--primary)';
        });
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = 'var(--primary)';
            if (e.dataTransfer.files.length) {
                handleFiles(e.dataTransfer.files);
            }
        });
    }
}

// ==================== File Handling ====================

function handleFileSelect(e) {
    handleFiles(e.target.files);
}

function handleFiles(files) {
    for (const file of files) {
        if (!file.type.startsWith('image/')) continue;

        const fileId = Math.random().toString(36).substr(2, 9);
        const reader = new FileReader();

        reader.onload = (e) => {
            const fileObj = {
                id: fileId,
                file: file,
                preview: e.target.result,
                status: 'pending' // pending, uploading, success, error
            };
            selectedFiles.push(fileObj);
            renderUploadList();
        };

        reader.readAsDataURL(file);
    }

    document.getElementById('uploadActions').classList.remove('d-none');
}

function renderUploadList() {
    const list = document.getElementById('uploadList');
    list.innerHTML = '';

    selectedFiles.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'preview-item';
        div.innerHTML = `
            <img src="${item.preview}" alt="Preview">
            <button class="remove-btn" onclick="removeFile('${item.id}')">&times;</button>
            <div style="position: absolute; bottom: 0; left: 0; width: 100%; text-align: center;">
                <span class="status-badge status-${item.status}">${item.status.toUpperCase()}</span>
            </div>
        `;
        list.appendChild(div);
    });

    if (selectedFiles.length === 0) {
        document.getElementById('uploadActions').classList.add('d-none');
    }
}

function removeFile(id) {
    selectedFiles = selectedFiles.filter(f => f.id !== id);
    renderUploadList();
}

function clearUploads() {
    selectedFiles = [];
    renderUploadList();
}

// ==================== Cloudinary Operations ====================

async function startUpload() {
    if (!config.cloudName || !config.uploadPreset) {
        showNotification('Please configure Cloudinary settings first!', 'error');
        return;
    }

    const pending = selectedFiles.filter(f => f.status === 'pending');
    if (pending.length === 0) return;

    showNotification(`Uploading ${pending.length} image(s)...`, 'info');

    for (const item of pending) {
        item.status = 'uploading';
        renderUploadList();

        try {
            const formData = new FormData();
            formData.append('file', item.file);
            formData.append('upload_preset', config.uploadPreset);
            formData.append('tags', config.galleryTag);

            const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                item.status = 'success';
                const data = await response.json();
                console.log('Uploaded:', data.secure_url);
            } else {
                const err = await response.json();
                console.error('Upload error:', err);
                item.status = 'error';
            }
        } catch (error) {
            console.error('Request error:', error);
            item.status = 'error';
        }
        renderUploadList();
    }

    const errors = selectedFiles.filter(f => f.status === 'error').length;
    if (errors === 0) {
        showNotification('All uploads completed successfully!', 'success');
        setTimeout(() => {
            selectedFiles = selectedFiles.filter(f => f.status !== 'success');
            renderUploadList();
            refreshGallery();
        }, 2000);
    } else {
        showNotification(`Finished with ${errors} error(s).`, 'warning');
    }
}

async function refreshGallery() {
    const listContainer = document.getElementById('galleryManagementList');
    if (!listContainer) return;

    if (!config.cloudName || !config.galleryTag) {
        listContainer.innerHTML = '<div class="text-center py-5 w-100 text-muted"><p>Configure Cloudinary to see live images.</p></div>';
        return;
    }

    try {
        // Fetch the list from Cloudinary (requires Resource List allowed in settings)
        const url = `https://res.cloudinary.com/${config.cloudName}/image/list/${config.galleryTag}.json?cb=${Date.now()}`;
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                listContainer.innerHTML = '<div class="text-center py-5 w-100 text-muted"><p>No images found with tag: ' + config.galleryTag + '</p></div>';
            } else {
                throw new Error('Could not fetch image list. Ensure "Resource List" is enabled in Cloudinary Security settings.');
            }
            return;
        }

        const data = await response.json();
        const resources = (data.resources || []).reverse();

        if (resources.length === 0) {
            listContainer.innerHTML = '<div class="text-center py-5 w-100 text-muted"><p>Gallery is empty. Try uploading some images!</p></div>';
            return;
        }

        listContainer.innerHTML = '';
        resources.forEach(res => {
            const div = document.createElement('div');
            div.className = 'manage-item';
            const imgUrl = `https://res.cloudinary.com/${config.cloudName}/image/upload/w_400,c_fill/${res.public_id}.${res.format}`;

            div.innerHTML = `
                <img src="${imgUrl}" alt="Gallery Image">
                <div class="info">
                    <div class="small text-truncate" title="${res.public_id}">${res.public_id}</div>
                    <div class="small text-muted">${res.width}x${res.height} | ${(res.bytes / 1024).toFixed(1)} KB</div>
                </div>
                <div class="actions">
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteImage('${res.public_id}')" title="Delete from Cloudinary">
                        <i class="fas fa-trash"></i>
                    </button>
                    <a href="https://res.cloudinary.com/${config.cloudName}/image/upload/${res.public_id}.${res.format}" target="_blank" class="btn btn-sm btn-outline-primary">
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            `;
            listContainer.appendChild(div);
        });

    } catch (error) {
        listContainer.innerHTML = `
            <div class="text-center py-5 w-100">
                <i class="fas fa-exclamation-triangle text-warning mb-2"></i>
                <p class="small text-muted px-4">${error.message}</p>
                <div class="mt-2 text-start p-3 bg-light text-dark rounded small">
                    <strong>Common Issue:</strong> Cloudinary block "Resource List" access by default. 
                    Go to <strong>Settings > Security</strong> and uncheck <strong>Resource List</strong> in "Restricted Media Types".
                </div>
            </div>`;
    }
}

async function deleteImage(publicId) {
    if (!config.apiKey || !config.apiSecret) {
        showNotification('Enter API Key and Secret to enable deletion.', 'warning');
        return;
    }

    if (!confirm(`Are you sure you want to delete this photo?\nPublic ID: ${publicId}\nThis cannot be undone.`)) {
        return;
    }

    try {
        const timestamp = Math.round((new Date()).getTime() / 1000);
        const signatureStr = `public_id=${publicId}&timestamp=${timestamp}${config.apiSecret}`;
        const signature = CryptoJS.SHA1(signatureStr).toString();

        const formData = new FormData();
        formData.append('public_id', publicId);
        formData.append('timestamp', timestamp);
        formData.append('api_key', config.apiKey);
        formData.append('signature', signature);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/destroy`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.result === 'ok') {
            showNotification('Photo deleted successfully!', 'success');
            refreshGallery();
        } else {
            console.error('Delete error:', result);
            showNotification(`Error: ${result.error?.message || result.result}`, 'error');
        }
    } catch (error) {
        console.error('Request error:', error);
        showNotification('Failed to delete image.', 'error');
    }
}

// ==================== Utilities ====================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.textContent = message;

    let bgColor = 'rgba(14, 165, 233, 0.9)'; // info
    if (type === 'success') bgColor = 'rgba(16, 185, 129, 0.9)';
    if (type === 'error' || type === 'warning') bgColor = 'rgba(239, 68, 68, 0.9)';

    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: ${bgColor};
        backdrop-filter: blur(10px);
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        font-weight: 600;
        animation: slideInRight 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;

    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease forwards';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Reuse theme logic from main site if available, or simple version
function initTheme() {
    const mode = localStorage.getItem('backgroundMode');
    if (mode === 'light') {
        document.body.classList.add('light-mode');
        document.documentElement.classList.add('light-mode');
        const bgText = document.getElementById('bg-mode-text');
        if (bgText) bgText.textContent = 'Dark Mode';
    }
}

function toggleBackgroundMode() {
    if (document.body.classList.contains('light-mode')) {
        document.body.classList.remove('light-mode');
        document.documentElement.classList.remove('light-mode');
        localStorage.setItem('backgroundMode', 'dark');
        document.getElementById('bg-mode-text').textContent = 'Light Mode';
    } else {
        document.body.classList.add('light-mode');
        document.documentElement.classList.add('light-mode');
        localStorage.setItem('backgroundMode', 'light');
        document.getElementById('bg-mode-text').textContent = 'Dark Mode';
    }
}
