precision highp float;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

float hash11(float p) {
	return fract(sin(p)*45768.23);
}

float hash21(vec2 p) {
	return fract(sin(p.x * 15.23 + p.y * 32.12) * 45768.23);
}

float hash31(vec3 p) {
	return fract(sin(p.x *15.23 + p.y * 35.87 + p.z * 75.53) * 45768.23);
}

vec2 hash22(vec2 p) {
	mat2 m = mat2(15.23, 32.12, 71.23, 152.31);
	return fract(sin(m*p)*45768.23);
}

vec3 hash33(vec3 p) {
	mat3 m = mat3(15.23, 35.11, 70.24, 151.22, 301.11 , 612.23, 1345.17, 2678.98, 5371.13);
	return fract(sin(m*p)*45768.23);
}

float value_noise(vec3 p) {
	vec3 g = floor(p);
	vec3 f = fract(p);
	float fbl = hash31(g + vec3(0.0, 0.0, 0.0));
	float fbr = hash31(g + vec3(1.0, 0.0, 0.0));
	float ftl = hash31(g + vec3(0.0, 1.0, 0.0));
	float ftr = hash31(g + vec3(1.0, 1.0, 0.0));
	float bbl = hash31(g + vec3(0.0, 0.0, 1.0));
	float bbr = hash31(g + vec3(1.0, 0.0, 1.0));
	float btl = hash31(g + vec3(0.0, 1.0, 1.0));
	float btr = hash31(g + vec3(1.0, 1.0, 1.0));
	
	float fb = mix(fbl, fbr, f.x);
	float ft = mix(ftl, ftr, f.x);
	float fres = mix(fb, ft, f.y);
	float bb = mix(bbl, bbr, f.x);
	float bt = mix(btl, btr, f.x);
	float bres = mix(bb, bt, f.y);
	
	float res = mix(fres, bres, f.z);
	return res;
}

float sdPlane(in vec3 p) {
    return p.y + value_noise(p);
    // return p.y;
}

float sdSphere(in vec3 p, in float r) {
    return length(p) - r;
}

float map(in vec3 p) {
    float d = sdPlane(p);
    d = min(d, sdSphere(p - vec3(0.0, 0.25, 0.0), 0.25)); // find surface compare 
    return d;
}

vec3 calcNormal(in vec3 p) {
	// calculate all surface`s normal
    vec3 e = vec3(0.001, 0.0, 0.0);
    vec3 nor = vec3(
        map(p + e.xyy) - map(p - e.xyy),
        map(p + e.yxy) - map(p - e.yxy),
        map(p + e.yyx) - map(p - e.yyx)
    );
    return normalize(nor);
}

float castRay(in vec3 cameraPosition, in vec3 renderVector, in float maxt) {
	// find surface
    float precis = 0.001;
    float h = precis * 2.0;
    float t = 0.0;
    for(int i = 0; i < 60; i++) {
        if(abs(h) < precis || t > maxt) continue;
        h = map(cameraPosition + renderVector * t);
        t += h;
    }
    return t;
}

float softshadow(in vec3 cameraPosition, in vec3 renderVector, in float mint, in float maxt, in float k) {
    float sh = 1.0;
    float t = mint;
    float h = 0.0;
    for(int i = 0; i < 30; i++) {
        if(t > maxt) continue;
        h = map(cameraPosition + renderVector * t);
        sh = min(sh, k * h / t);
        t += h;
    }
    return sh;
}

vec3 render(in vec3 cameraPosition, in vec3 renderVector) {
    vec3 col = vec3(1.0);
    float distanceFromCamera = castRay(cameraPosition, renderVector, 20.0); // distance camera to target
    vec3 pos = cameraPosition + renderVector * distanceFromCamera; //surface`s point?
    vec3 nor = calcNormal(pos); // calculate all surface`s normal
    vec3 lig = normalize(vec3(-0.4, 0.7, 0.5)); // light`s vector
    float dif = clamp(dot(lig, nor), 0.0, 1.0); // light`s strenght -> color
    float spec = pow(clamp(dot(reflect(renderVector, nor), lig), 0.0, 1.0), 16.0);
    float sh = softshadow(pos, lig, 0.02, 20.0, 7.0);
    col = col * (dif + spec) * sh;
    return col;
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= resolution.x / resolution.y;
    // vec3 cameraPosition = vec3(1.0, 1.0, 3.0); //camera ray origin
    vec3 cameraPosition = vec3( mouse.x*4.0, 1.0, 3.0); //camera ray origin
    vec3 targetOrigin = vec3(0.0, 0.0, 0.0); //target
    vec3 eyeToTarget = normalize(targetOrigin - cameraPosition); //eye to target vector
    vec3 upVector = vec3(0.0, 1.0, 0.0); //up vector
    vec3 targetUpVector = normalize(cross(eyeToTarget, upVector)); // target`s right coorenderVector 
    vec3 targetRightVector = normalize(cross(targetUpVector, eyeToTarget)); // target`s up coorenderVector  
    vec3 renderVector = normalize(p.x * targetUpVector + p.y * targetRightVector + mouse.y*2.5 * eyeToTarget); //viewer`s vector
    vec3 col = render(cameraPosition, renderVector);
    
    gl_FragColor = vec4(col, 1.0);
}