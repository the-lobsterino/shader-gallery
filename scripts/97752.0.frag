
// Set the color of the sky
vec3 skyColor = vec3(0.5, 0.7, 1.0);

void main() {
    // Set the output color of the fragment to the sky color
    gl_FragColor = vec4(skyColor, 1.0);

GLuint skybox = createSkybox(skyColor);

// Set the skybox as the background for the scene
glClearColor(0.0, 0.0, 0.0, 0.0);
glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

// Draw the skybox

	drawSkybox(skybox);}}