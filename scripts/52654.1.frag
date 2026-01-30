#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// rendering constants
const float ballReflectivity = 0.2;
const float ballDiffusion = 0.2;
const float ballRefractionIndex = 1.1;
const vec3 ballColor = vec3(0.0, 0.0, 1.0);
const vec3 sunDirection = normalize(vec3(1.0, -1.0, 1.0));
const float coneStackDiffusion = 0.6;
const float coneStackAmbient = 0.2;
const float coneStackReflectivity = 0.2;
const vec3 coneStackColor = vec3(1.0, 0.0, 0.0);

// geometry constants
const float ballRadius = 30.0;
const float coneStackAngle = 0.7;
const vec3 coneStackAxis = normalize(-vec3(1.0, 1.0, 1.0));
const float coneStackGap1Start = 0.3;
const float coneStackGap1End = 0.5;
const float coneStackGap2Start = 0.6;
const float coneStackGap2End = 0.7;

// computed geometry constants
const float coneStackHeight = ballRadius * cos(coneStackAngle); // a = h * cos(theta)
const float coneBaseRadius = sqrt(pow(coneStackHeight, 2.0) + pow(ballRadius, 2.0));


float ballIntersect(vec3 ro, vec3 rd) {
    float a = dot(rd, rd);
    float b = 2.0 * dot(rd, ro);
    float c = dot(ro, ro) - (ballRadius * ballRadius);
    if (b*b - 4.0*a*c < 0.0) {
        return -1.0;
    }
    return (-b - sqrt((b*b) - 4.0*a*c))/(2.0*a);
}

float intersectPlane(vec3 axis, vec3 point, vec3 ro, vec3 rd) 
{ 
    // assuming vectors are all normalized
    float denom = dot(axis, rd); 
    if (denom > 1e-6) { 
        vec3 p = point - ro; 
        float d = dot(p, axis) / denom; 
        if (d >= 0.0)
		return d;
    } 
 
    return -1.0; 
} 

// cone intersection is tricky. See bottom of file
float coneStackConeIntersect(vec3 ro, vec3 rd, out vec3 n);

float coneStackIntersect(vec3 ro, vec3 rd, out vec3 n) {
	float d = coneStackConeIntersect(ro, rd, n);
	
	if (d > 0.0) {
		vec3 p = ro + d * rd;
		float t = length(p)/ballRadius;
		if (t > coneStackGap1Start && t < coneStackGap1End) {
			return -1.0;
		}
	}
	
	return d;
}

vec3 skyColor(vec3 dir) {
	float spec = pow(max(0.0, dot(dir, sunDirection)), 32.0);
	return vec3(0.6 + dir.y*0.2, 0.6, 0.8) + spec*vec3(1.0, 1.0, 0.7);
}

mat4 rotationMatrix(vec3 axis, float angle);

void main( void ) {

	vec2 p = 2.0*(vec2(0.5) - ( gl_FragCoord.xy / resolution.xy ));
	p.x *= resolution.x/resolution.y;
	
	vec3 ro = vec3(0.0, 0.0, -100.0);
	vec3 rd = normalize(vec3(p.x, p.y, 2.0));
	mat4 rot = rotationMatrix(vec3(0.0, 1.0, 0.0), mouse.x*12.0)
		* rotationMatrix(vec3(1.0, 0.0, 0.0), mouse.y*2.0);
	
	ro = (rot * vec4(ro, 1.0)).xyz;
	rd = (rot * vec4(rd, 0.0)).xyz;
	
	vec3 color = vec3(0.0);
	float significance = 1.0;
	
	// intersect with ball exterior
	float d = ballIntersect(ro, rd);
	if (d > 0.0) {
		ro = ro + d*1.001*rd;
		vec3 n = normalize(ro);
				
		// reflection
		vec3 rfd = reflect(rd, n);
		color += skyColor(rfd) * significance * ballReflectivity;
		
		// diffuse
		float diff = max(dot(n, sunDirection), 0.0); 
		color += diff * ballColor * significance * ballDiffusion;
		
		significance *= (1.0 - ballReflectivity - ballDiffusion);
		
		// refract
		rd = refract(rd, n, 1.0/ballRefractionIndex);
		
		// intersect with cone sections
		d = coneStackIntersect(ro, rd, n);
		if (d > 0.0) {
			ro = ro + d*1.001*rd;
			
			color += coneStackColor * coneStackAmbient * significance;
			
			float diff = max(dot(n, sunDirection), 0.0);
			color += diff * coneStackColor * coneStackDiffusion * significance;
			
			significance *= (1.0 - coneStackAmbient - coneStackDiffusion);
		}
	}
	
	// sky intersection
	color += significance * skyColor(rd);

	gl_FragColor = vec4( color, 1.0 );

}

//==[Borrowed:https://www.shadertoy.com/view/MtcXWr]========
struct Ray
{
    vec3 o;  // origin
    vec3 d;  // direction
};

struct Hit
{
    float t; // solution to p=o+t*d
    vec3 n;  // normal
};
const Hit noHit = Hit(1e10, vec3(0.));
struct Cone
{
   float cosa;	// half cone angle
    float h;	// height
    vec3 c;     // tip position
    vec3 v;     // axis
};
Hit intersectCone(Cone s, Ray r)
{
    vec3 co = r.o - s.c;

    float a = dot(r.d,s.v)*dot(r.d,s.v) - s.cosa*s.cosa;
    float b = 2. * (dot(r.d,s.v)*dot(co,s.v) - dot(r.d,co)*s.cosa*s.cosa);
    float c = dot(co,s.v)*dot(co,s.v) - dot(co,co)*s.cosa*s.cosa;

    float det = b*b - 4.*a*c;
    if (det < 0.) return noHit;

    det = sqrt(det);
    float t1 = (-b - det) / (2. * a);
    float t2 = (-b + det) / (2. * a);

    // This is a bit messy; there ought to be a more elegant solution.
    float t = t1;
    if (t < 0. || t2 > 0. && t2 < t) t = t2;
    if (t < 0.) return noHit;

    vec3 cp = r.o + t*r.d - s.c;
    float h = dot(cp, s.v);
    if (h < 0. || h > s.h) return noHit;

    vec3 n = normalize(cp * dot(s.v, cp) / dot(cp, cp) - s.v);

    return Hit(t, n);
}
// ==============================================/

float coneStackConeIntersect(vec3 ro, vec3 rd, out vec3 n) {
	// base of the cone
	vec3 p0 = coneStackAxis * coneStackHeight;
	float d = intersectPlane(-coneStackAxis, p0, ro, rd);
	if (d > 0.0 && length((ro + rd * d) - p0) < coneBaseRadius) {
		n = -coneStackAxis;
		return d;
	}
	
	// cone intersect code above
	Cone c = Cone(coneStackAngle*1.09, coneStackHeight, vec3(0.0), coneStackAxis);
	Ray r = Ray(ro, rd);
	Hit h = intersectCone(c, r);
	n = h.n;
	if (h.t > 9999.1)
		return -1.0;
	else
		return h.t;
}
		    
// ==[borrowed from:http://www.neilmendoza.com/glsl-rotation-about-an-arbitrary-axis/]========
mat4 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}
// ============================================/