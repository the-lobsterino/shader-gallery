// BEGIN: shadertoy porting template
// https://gam0022.net/blog/2019/03/04/porting-from-shadertoy-to-glslsandbox/
precision highp float;

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

#define iResolution resolution
#define iTime time
#define iMouse mouse

void mainImage(out vec4 fragColor, in vec2 fragCoord);

void main(void) {
    vec4 col;
    mainImage(col, gl_FragCoord.xy);
    gl_FragColor = col;
}


// Define maximum marching steps 
const int maxMarchSteps = 255;
// Define minimum distance 
const float minDist = 0.0;
// Define maximum distance 
const float maxDist = 100.0;
const float epsilon = 0.0001; 

// Sphere SDF 
float sphereSDF(vec3 samplePoint) {
    return length(samplePoint) - 1.0;
}

// Cube SDF 
float ubox(vec3 samplePoint) {
    return length(max(abs(samplePoint) - vec3(1.0, 1.0, 1.0), 0.0));
}

// Constructuve solid geometry functions 
// For intersections 
float intersectSDF(float distA, float distB) {
    return max(distA, distB);
}
// For unions 
float unionSDF(float distA, float distB) {
    return min(distA, distB);
}
// For differences 
float differenceSDF(float distA, float distB) {
    return max(distA, -distB);
}

// Rotation transformation 
// About y-axis
mat4 rotateY(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    
    return mat4(
        vec4(c, 0, s, 0),
        vec4(0, 1, 0, 0),
        vec4(-s, 0, c, 0),
        vec4(0, 0, 0, 1)
	);
}
// About x-axis  
mat4 rotateX(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    
    return mat4(
        vec4(1, 0, 0, 0),
        vec4(0, c, -s, 0),
        vec4(0, s, c, 0),
        vec4(0, 0, 0, 1)
	);
}
// About z-axis 
mat4 rotateZ(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    
    return mat4(
        vec4(c, -s, 0, 0),
        vec4(s, c, 0, 0),
        vec4(0, s, 1, 0),
        vec4(0, 0, 0, 1)
	);
}

float sceneSDF(vec3 samplePoint) {
    // Rotate entire scene 
    samplePoint = (rotateY(iTime / 2.0) * vec4(samplePoint, 1.0)).xyz;
    // Box distortions 
    float boxX = 0.2;
    float boxY = 1.5;
    float boxZ = 1.5; 
    vec3 wallPoint = (rotateX(iTime) * vec4(samplePoint, 1.0)).xyz;
    float sphereShapeChange = 0.5 * sin(2.0 * iTime) + 0.5;
    float sphere = sphereSDF(samplePoint / sphereShapeChange) * sphereShapeChange;
    float wall = ubox(wallPoint / vec3(boxX, boxY, boxZ)) * min(boxX, min(boxY, boxZ));
	float hole = differenceSDF(wall, sphere);
    float ball = sphereSDF((samplePoint + vec3(2.0 * sin(iTime - 3.14 / 4.0), 0.0, 0.0))/ 0.5) * 0.5;
    return unionSDF(hole, ball);
	//return hole;
}

// Ray marching function to find
// shortest distance from eyepoint to scene surface 
// follow marching direction 
// eye: Origin of ray, eye point 
// marchDirection: normalized direction to march in 
// start: Starting distance away from eye
// End: Max distance from eye to march 
float rayMarch(vec3 eye, vec3 marchingDirection, 
               float start, float end) {
	// Define starting depth 
    float depth = start;
    // March until maxMarchSteps is reached
    for (int i = 0; i < maxMarchSteps; i++) {
        // Obtain distance from closest surface 
        float dist = sceneSDF(eye + depth *
                              marchingDirection);
        // Determine if marched inside surface
        if (dist < epsilon) {
            // Inside scene surface
            return depth; 
        }
        // Update depth 
        depth += dist;
        // Determine if marched too far 
        if (depth >= end) {
            // Return farthest allowable
            return end;
        }
    }
    // Return distance if marched more than max steps
    return end;
}

// Return normalized direction to march in from eye
// fov: vertical field of view in degrees 
// size: resolution of output image
// fragCoord: x, y coordinates of pixel in output 
vec3 rayDirection(float fov, vec2 size, vec2 fragCoords) {
    // Center coordinate system 
    // Define x and y coordinates 
    vec2 xy = fragCoords - size / 2.0;
    // Find z
    float z = size.y / tan(radians(fov) / 2.0);
    // Return normalized direction to march 
    return normalize(vec3(xy, -z));
}

// Esimate normal on surface 
vec3 estimateNormal(vec3 p) {
    return normalize(vec3(
        sceneSDF(vec3(p.x + epsilon, p.y, p.z)) - sceneSDF(vec3(p.x - epsilon, p.y, p.z)),
        sceneSDF(vec3(p.x, p.y + epsilon, p.z)) - sceneSDF(vec3(p.x, p.y - epsilon, p.z)),
        sceneSDF(vec3(p.x, p.y, p.z + epsilon)) - sceneSDF(vec3(p.x, p.y, p.z - epsilon))
    ));
}

// Calculate lighting contribution of single point light source
// Return: RGB color of light's contribution 
// k_a: Ambient color 
// k_d: Diffuse color 
// k_s: Specular color 
// alpha: Shininess coefficient 
// p: Position of point being lit 
// eye: Position of camera 
// lightPos: Position of light 
// lightIntensity: color / intensity of light 
vec3 phongContribForLight(vec3 k_d, vec3 k_s, float alpha,
                          vec3 p, vec3 eye, vec3 lightPos,
                          vec3 lightIntensity) {
    // Get normal vector at position p 
    vec3 N = estimateNormal(p);
    // Get direction of light to position p
    vec3 L = normalize(lightPos - p);
    // Get direction of camera to position p
    vec3 V = normalize(eye - p);
    // Get direction of reflection 
    vec3 R = normalize(reflect(-L, N));
    
    // Obtain dot product between light and normal 
    float dotLN = dot(L, N);
    // Obtain dot product between reflection and view ray 
    float dotRV = dot(R, V);
    
    // Light not visible from this point on surface
    if (dotLN < 0.0) {
        return vec3(0.0, 0.0, 0.0);
    }
    
    // Determine if light reflection is viewable 
    // from viewer
    if (dotRV < 0.0) {
        // If light reflection is opposite direction of viewer
        // Apply only diffuse lighting 
        return lightIntensity * (k_d * dotLN);
    }
    
    // Return phong lighting contribution 
    return lightIntensity * (k_d * dotLN + k_s * pow(dotRV, alpha));
}

// Phong illumination 
// Return RGB color of point after lighting contribution 
// k_a: Ambient color 
// k_d: Diffuse color 
// k_s: Specular color
// alpha: Shininess coefficient 
// p: Position of point being lit 
// eye: Position of camera 
vec3 phongIllumination(vec3 k_a, vec3 k_d, vec3 k_s, float alpha, vec3 p, vec3 eye) {
	// Define ambient light intensity 
    const vec3 ambientLight = 0.5 * vec3(1.0, 1.0, 1.0);
    // Calculate color from ambient light 
    vec3 color = ambientLight * k_a;
    
    // Define light 1 
    vec3 light1Pos = vec3(4.0 * sin(iTime), 
                          2.0,
                          4.0 * cos(iTime));
    vec3 light1Intensity = vec3(0.4, 0.4, 0.4);
    color += phongContribForLight(k_d, k_s, alpha, p, 
                                  eye, light1Pos,
                                  light1Intensity);
    
    // Define light 2 
    vec3 light2Pos = vec3(2.0 * sin(0.37 * iTime), 
                          2.0 * cos(0.37 * iTime),
                          2.0);
    float light2IntensityComp = 0.5*sin(iTime)+0.5; 
    vec3 light2Intensity = vec3(light2IntensityComp,
                                light2IntensityComp,
                               	light2IntensityComp);
    color += phongContribForLight(k_d, k_s, alpha, p,
                                  eye, light2Pos,
                                  light2Intensity);
    return color;
}

// Return transformation matrix that will transform a 
// ray from view space to world coordinates 
// given a eye point, a camera target, and a up vector
mat4 viewMatrix(vec3 eye, vec3 center, vec3 up) {
    // Define direction from camera to target 
    vec3 f = normalize(center - eye);
    // Define right vector 
    vec3 s = normalize(cross(f, up));
    // Define new up for camera 
    vec3 u = cross(s, f);
    // Return transformation matrix 
    return mat4(
        vec4(s, 0.0),
        vec4(u, 0.0),
        vec4(-f, 0.0),
        vec4(0.0, 0.0, 0.0, 1)
    );
}
    

// Main 
void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	// Obtain view direction
    vec3 viewDir = rayDirection(45.0, iResolution.xy, fragCoord);
    // Define camera position 
    vec3 eye = vec3(8.0, 5.0, 7.0);
    // Obtain transformation matrix 
    // Point camera at target 
    mat4 viewToWorld = viewMatrix(eye, vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));
    // Apply transformation 
    vec3 worldDir = (viewToWorld * vec4(viewDir, 0.0)).xyz;
    // Obtain SDF with eye 
    float dist = rayMarch(eye, worldDir, minDist, maxDist);
    
    // Set background as black
    // if ray did not intersect a surface 
    if (dist > maxDist - epsilon) {
        	fragColor = vec4(0.0, 0.0, 0.0, 0.0);
        	return;
    }
    
    // Apply lighting 
    // Find closest point on surface to eyepoint
    // along view ray 
    vec3 p = eye + dist * worldDir; 
    // Define ambient light color 
    // Defined based on normal estimates 
    vec3 K_a = (estimateNormal(p) + vec3(1.0)) / 2.0;
    // Define diffuse light color 
    vec3 K_d = K_a;
    // Defien specular light color 
    vec3 K_s = vec3(1.0, 1.0, 1.0);
    // Set object shininess 
    float shininess = 10.0;
    // Obtain color 
    vec3 color = phongIllumination(K_a, K_d, K_s, shininess, p, eye);
    // Set fragment color 
    fragColor = vec4(color, 1.0);
}