
/*
 * Original shader from: https://www.shadertoy.com/view/XtfXDS
 */
 
#ifdef GL_ES
precision highp float;
#endif
 
// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
 
// shadertoy emulation
#define iTime time
#define iResolution resolution
 
// Emulate a black texture
#define texture(s, uv) vec4(0.0)
#define textureLod(s, uv, lod) vec4(0.0)
 
// --------[ Original ShaderToy begins here ]---------- //
 
//float t;
vec3 getRay(in vec3 cameraDir, in vec2 uv) { //get camear ray direction
    vec3 cameraPlaneU = vec3(normalize(vec2(cameraDir.y, -cameraDir.x)), 0);
    vec3 cameraPlaneV = cross(cameraPlaneU, cameraDir) ;
	return normalize(cameraDir + uv.x * cameraPlaneU + uv.y * cameraPlaneV);
}
vec3 hash33(vec3 p3)
{ //by Dave_Hoskins https://www.shadertoy.com/view/4djSRW
	p3 = fract(p3 * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yxz+33.33);
    return fract((p3.xxy + p3.yxx)*p3.zyx);
 
}
float vorinoi(in vec3 p) { //3d vorinoi
	float t = 0.0;
    //p.z += t;
	vec3 gv = floor(p);
    vec3 f = fract(p);
    float d = 1.0; //starting distance
    for (int x = -1; x <= 1; x += 1) {
        for (int y = -1; y <= 1; y += 1) {
            for (int z = -1; z <= 1; z += 1) {
            	vec3 pp = vec3(x, y, z);
                vec3 p = gv-pp;
                vec3 of = (sin(hash33(p)+(t+10.)*hash33(p*0.5))-0.5)*0.5; //animated 3d cells
                
                d = min(d, length(pp+of+f));
            }
        }
    }
    return d;
}
 
float sdBox( vec3 p, vec3 b )
{
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}
 
 
float sdf(in vec3 p) { //signed distance function - vorinoi inside a sphere
 
	//float dd = sdBox(p,vec3(0.8));
	//float dd1 = sdBox(p,vec3(0.4,1.0,0.4));
	//dd = max(dd,-dd1);
	float dd = length(p)-1.1;
	
float scale = 11.0+(sin(iTime*.5)*2.0);
    float v = (vorinoi(p*scale))-0.3;
	return max(dd, v/scale);
//	return max(length(p)-0.9, v/scale);
}
vec3 getColor(in vec3 ro, in vec3 rd) {
	float d0 = 0.0;
    vec3 p;
    for (int i = 0; i < 10; i += 1) {
    	p = ro+rd*d0;
        float d = sdf(p);
        d0 += d;
        if (d < 0.001 || d0 > 100.) break;
    }
    d0 = abs(1.0-d0);
    return vec3(1.0-d0,0.8-d0,0.0);
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float t = iTime;
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
	uv *= 2.0;
    
    //camera
    vec2 m = vec2(t*0.2, 1.5);
        
    vec3 ro = vec3(sin(m.y) * cos(-m.x), sin(m.y) * sin(-m.x), cos(m.y))*2.3;
    vec3 rd = getRay(-normalize(ro), uv);
    
    //render
    vec3 color = getColor(ro, rd);
    fragColor = vec4(color, 1);
}
 
// --------[ Original ShaderToy ends here ]---------- //
 
void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}