/*
 * Original shader from: https://www.shadertoy.com/view/XlsXD2
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //


vec3 cpos = vec3(0,0,5);
mat3 cam;
vec3 light = normalize(vec3(.6, .6, 1));

#define K .21
#define smoothen(d1,d2)  -log( exp(-K*(d1)) + exp(-K*(d2)) ) / K

mat3 rotMatrix(float angle, vec3 a){
    a = normalize(a);
    float s= sin(angle), c= cos(angle);

    return   mat3(a.x*a, a.y*a, a.z*a) * (1.-c)
           + mat3(     c, a.z*s, -a.y*s,
                  -a.z*s,     c,  a.x*s,
                   a.y*s, -a.x*s,     c  );
}

float dist(vec3 p){
    float  t = iTime/60.;
    mat3 rm0 = rotMatrix(    t*6.3 + p.x*.005, vec3(1,0,0) );
    mat3 rm1 = rotMatrix( 2.*t*6.3 + p.y*.006, vec3(0,1,0) );
    mat3 rm2 = rotMatrix( 3.*t*6.3 + p.z*.007, vec3(0,0,1) );
    p = rm0 * rm1 * rm2 * p;
    p = mod(p, 48.) - 24.;
    float d0 = length(p.xy) - 1.;
    float d1 = 100.;
    float d2 = length(p.zx) - 2.;

    return smoothen(d0, smoothen(d1, d2));
}

#define EPS vec2(.001, 0)
#define norm(p) normalize(dist(p) - vec3(dist(p-EPS.xyy), dist(p-EPS.yxy), dist(p-EPS.yyx)));


vec4 phong(vec3 p, vec3 ray) {
    vec3 n = norm(p);
    return   vec4(.1) * .5 
           + vec4(.3) * clamp(dot(light, n) * .5, .0, 1.)
		   + pow(clamp(dot(normalize(light-ray), n), .0, 1.), 128.);
}

void mainImage(out vec4 o, vec2 uv )
{
	vec2 R = iResolution.xy,
         p = (uv * 2. - R) / min(R.x, R.y);
    cam[0] = -normalize(cpos),
    cam[1] = vec3(1,0,0),
    cam[2] = cross(cam[1], cam[0]);
	vec3 ray = normalize(cam*vec3(2,p));

	float len = 0., di;
	vec3 rhead = cpos;
	for(int i = 0; i < 128; i++){
		di = dist(rhead);
        if (abs(di) < .001) break;
		len += di;
		rhead = cpos + len * ray;
	}

	o = abs(di)<.001 ? phong(rhead, ray) : vec4(0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}