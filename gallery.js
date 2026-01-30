// === GLSL Gallery ===

const GLSL_SANDBOX_URL = 'http://glslsandbox.com/e#';
let shaders = [];
let relations = {};
let currentShader = null;
let gl = null;
let program = null;
let animationId = null;

// === INITIALIZATION ===
async function init() {
    try {
        // Load manifest
        const manifest = await fetch('manifest.json').then(r => r.json());
        shaders = manifest.shaders || [];
        
        // Try to load relations
        try {
            relations = await fetch('relations.json').then(r => r.json());
        } catch (e) {
            console.log('No relations.json found, related shaders disabled');
        }
        
        document.getElementById('shader-count').textContent = shaders.length;
        document.getElementById('loading').classList.add('hidden');
        
        renderGallery(shaders);
        setupSearch();
        setupViewer();
    } catch (e) {
        console.error('Failed to load:', e);
        document.getElementById('loading').innerHTML = '<p>Error loading gallery. Make sure manifest.json exists.</p>';
    }
}

// === GALLERY RENDERING ===
function renderGallery(shaderList) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    
    shaderList.forEach(id => {
        const card = document.createElement('div');
        card.className = 'shader-card';
        card.dataset.id = id;
        
        const img = document.createElement('img');
        img.src = `thumbs/${id}.png`;
        img.alt = `Shader ${id}`;
        img.onerror = () => {
            card.classList.add('no-thumb');
            img.remove();
        };
        
        const label = document.createElement('div');
        label.className = 'shader-id';
        label.textContent = `#${id}`;
        
        card.appendChild(img);
        card.appendChild(label);
        card.addEventListener('click', () => openShader(id));
        gallery.appendChild(card);
    });
}

// === SEARCH ===
function setupSearch() {
    const input = document.getElementById('search');
    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query === '') {
            renderGallery(shaders);
        } else {
            const filtered = shaders.filter(id => id.includes(query));
            renderGallery(filtered);
        }
    });
}

// === VIEWER ===
function setupViewer() {
    const viewer = document.getElementById('viewer');
    const closeBtn = document.getElementById('viewer-close');
    
    closeBtn.addEventListener('click', closeViewer);
    viewer.addEventListener('click', (e) => {
        if (e.target === viewer) closeViewer();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeViewer();
    });
}

async function openShader(id) {
    currentShader = id;
    const viewer = document.getElementById('viewer');
    viewer.classList.add('active');
    
    document.getElementById('viewer-title').textContent = `Shader #${id}`;
    document.getElementById('viewer-link').href = GLSL_SANDBOX_URL + id;
    
    // Load and display code
    try {
        const code = await fetch(`scripts/${id}.frag`).then(r => r.text());
        document.getElementById('shader-code').textContent = code;
        runShader(code);
    } catch (e) {
        document.getElementById('shader-code').textContent = 'Failed to load shader code';
        console.error('Failed to load shader:', e);
    }
    
    // Load related shaders
    loadRelated(id);
}

function closeViewer() {
    const viewer = document.getElementById('viewer');
    viewer.classList.remove('active');
    stopShader();
    currentShader = null;
}

// === SHADER RENDERING ===
function runShader(fragmentSource) {
    const canvas = document.getElementById('shader-canvas');
    const errorDiv = document.getElementById('shader-error');
    errorDiv.style.display = 'none';
    
    gl = canvas.getContext('webgl');
    if (!gl) {
        errorDiv.textContent = 'WebGL not supported';
        errorDiv.style.display = 'block';
        return;
    }
    
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    
    // Vertex shader
    const vertexSource = `
        attribute vec2 position;
        void main() {
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;
    
    // Wrap fragment shader with uniforms
    const wrappedFragment = `
        precision highp float;
        uniform float time;
        uniform vec2 resolution;
        uniform vec2 mouse;
        
        ${fragmentSource}
    `;
    
    try {
        const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = compileShader(gl.FRAGMENT_SHADER, wrappedFragment);
        
        program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(gl.getProgramInfoLog(program));
        }
        
        gl.useProgram(program);
        
        // Create fullscreen quad
        const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        
        const posLoc = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
        
        // Start animation
        const startTime = Date.now();
        const timeLoc = gl.getUniformLocation(program, 'time');
        const resLoc = gl.getUniformLocation(program, 'resolution');
        const mouseLoc = gl.getUniformLocation(program, 'mouse');
        
        function render() {
            if (!gl) return;
            
            const time = (Date.now() - startTime) / 1000;
            gl.uniform1f(timeLoc, time);
            gl.uniform2f(resLoc, canvas.width, canvas.height);
            gl.uniform2f(mouseLoc, 0.5, 0.5);
            
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            animationId = requestAnimationFrame(render);
        }
        render();
        
    } catch (e) {
        errorDiv.textContent = 'Shader error: ' + e.message;
        errorDiv.style.display = 'block';
        console.error('Shader error:', e);
    }
}

function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader));
    }
    return shader;
}

function stopShader() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    gl = null;
    program = null;
}

// === RELATED SHADERS ===
function loadRelated(id) {
    const container = document.getElementById('related-shaders');
    const level2 = document.querySelector('#related-2nd .related-grid');
    const level3 = document.querySelector('#related-3rd .related-grid');
    
    container.innerHTML = '';
    level2.innerHTML = '';
    level3.innerHTML = '';
    
    if (!relations[id]) {
        container.innerHTML = '<p style="color: var(--text-dim)">No related shaders found</p>';
        return;
    }
    
    // 1st degree related
    const firstDegree = relations[id].slice(0, 10);
    firstDegree.forEach(relId => {
        container.appendChild(createRelatedCard(relId));
    });
    
    // 2nd degree related (related to related)
    const secondDegree = new Map();
    firstDegree.forEach(relId => {
        if (relations[relId]) {
            relations[relId].forEach(rel2Id => {
                if (rel2Id !== id && !firstDegree.includes(rel2Id)) {
                    secondDegree.set(rel2Id, (secondDegree.get(rel2Id) || 0) + 1);
                }
            });
        }
    });
    
    // Sort by number of appearances
    const sorted2nd = [...secondDegree.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([id]) => id);
    
    sorted2nd.forEach(relId => {
        level2.appendChild(createRelatedCard(relId));
    });
    
    // 3rd degree related
    const thirdDegree = new Map();
    sorted2nd.forEach(relId => {
        if (relations[relId]) {
            relations[relId].forEach(rel3Id => {
                if (rel3Id !== id && !firstDegree.includes(rel3Id) && !sorted2nd.includes(rel3Id)) {
                    thirdDegree.set(rel3Id, (thirdDegree.get(rel3Id) || 0) + 1);
                }
            });
        }
    });
    
    const sorted3rd = [...thirdDegree.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 30)
        .map(([id]) => id);
    
    sorted3rd.forEach(relId => {
        level3.appendChild(createRelatedCard(relId));
    });
}

function createRelatedCard(id) {
    const card = document.createElement('div');
    card.className = 'shader-card';
    card.dataset.id = id;
    
    const img = document.createElement('img');
    img.src = `thumbs/${id}.png`;
    img.alt = `Shader ${id}`;
    img.onerror = () => {
        card.classList.add('no-thumb');
        img.remove();
    };
    
    card.appendChild(img);
    card.addEventListener('click', () => openShader(id));
    return card;
}

// === START ===
document.addEventListener('DOMContentLoaded', init);
