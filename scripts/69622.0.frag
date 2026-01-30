#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MAXSTEPS 100
#define STEPSIZE 0.1
#define HITEPSILON 0.0001

vec3 getCameraRayDir(vec2 uv, vec3 camPos, vec3 camTarget) {
 
    vec3 camForward = normalize(camTarget - camPos);
    vec3 camRight = normalize(cross(vec3(0.0, 1.0, 1.0), camForward));
    vec3 camUp = normalize(cross(camForward, camRight));
     
    float fPersp = 2.0;
    vec3 vDir = normalize(uv.x * camRight + uv.y * camUp + camForward * fPersp);
 
    return vDir;
}

float sdSphere(vec3 p, float r)
{
    return length(p) - r;
}

float sdPlane(vec3 p, vec4 n)
{
    return dot(p, n.xyz) + n.w;
}
 
float sdf(vec3 pos) {
    	float t = sdSphere(pos-vec3(0.0, 0.0, 10.0), 3.0);
	t = min(t, sdPlane(pos, vec4(0., 1., 0., 2.)));
     
    return t;
}

vec3 calcNormal(vec3 pos)
{
    float c = sdf(pos);
    vec2 eps_zero = vec2(0.001, 0.0);
    return normalize(vec3( sdf(pos + eps_zero.xyy), sdf(pos + eps_zero.yxy), sdf(pos + eps_zero.yyx) ) - c);
}

float rayMarch(vec3 rayOrigin, vec3 rayDir) {
	float tmax = 20.0;
    	float t = 0.0; 
    
	for (int i = 0; i < MAXSTEPS; i++) {
		float res = sdf(rayOrigin + rayDir * t);
		if (res < HITEPSILON)
		    return t;
		
		if (res > tmax)
		    return -1.0;
		
		t += res;
    	}
    
    return -1.0;
}

vec3 render(vec3 rayOrigin, vec3 rayDir) {
	float t = rayMarch(rayOrigin, rayDir);
	vec3 current = rayOrigin + rayDir * t;
	if (t == -1.)
		return vec3(0.30, 0.36, 0.60) - rayDir.y * 1.;
	
	
	vec3 objectSurfaceColour = vec3(0.4, 0.8, 0.1);
	vec3 N = calcNormal(current);
	vec3 col = objectSurfaceColour;
	col = pow(col, vec3(0.4545));
	
	vec3 lightPos = normalize(vec3(-3.,-10., 1.));
	vec3 L = normalize(vec3(1., 7., -6.));
	
	float NoL = max(dot(N, L), 0.0);
	vec3 LDirectional = vec3(0.9, 0.9, 0.8) * NoL;
	vec3 LAmbient = vec3(0.03, 0.04, 0.1);
	vec3 diffuse = col * (LDirectional + LAmbient);
	
        return diffuse;
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy / resolution.xy) * 2. - 1.;
	uv.x *= resolution.x/resolution.y;
	
	vec3 camPos = vec3(0., 0., -1);
	vec3 camDir = vec3(0.);
	
	vec3 rayDir = getCameraRayDir(uv, camPos, camDir);
	vec3 color = render(camPos, rayDir);
	

	gl_FragColor = vec4(color, 1.0 );

}