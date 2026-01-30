/*
 * Original shader from: https://www.shadertoy.com/view/ltSSzW
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
const vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //


#define PIXEL_SIZE 4.0


bool getValue(float brightness, vec2 pos) {
    
    // do the simple math first
    if (brightness > 16.0/17.0) return false;
    if (brightness < 01.0/17.0) return true;
    
    vec2 pixel = floor(mod((pos.xy+0.5)/PIXEL_SIZE, 4.0));
    int x = int(pixel.x);
    int y = int(pixel.y);
    bool result = false;
    
    // compute the 16 values by hand, store when it's a match
    	 if (x == 0 && y == 0) result = brightness < 16.0/17.0;
   	else if (x == 2 && y == 2) result = brightness < 15.0/17.0;
   	else if (x == 2 && y == 0) result = brightness < 14.0/17.0;
   	else if (x == 0 && y == 2) result = brightness < 13.0/17.0;
   	else if (x == 1 && y == 1) result = brightness < 12.0/17.0;
   	else if (x == 3 && y == 3) result = brightness < 11.0/17.0;
   	else if (x == 3 && y == 1) result = brightness < 10.0/17.0;
   	else if (x == 1 && y == 3) result = brightness < 09.0/17.0;
   	else if (x == 1 && y == 0) result = brightness < 08.0/17.0;
   	else if (x == 3 && y == 2) result = brightness < 07.0/17.0;
   	else if (x == 3 && y == 0) result = brightness < 06.0/17.0;
    else if (x == 0 && y == 1) result =	brightness < 05.0/17.0;
   	else if (x == 1 && y == 2) result = brightness < 04.0/17.0;
   	else if (x == 2 && y == 3) result = brightness < 03.0/17.0;
   	else if (x == 2 && y == 1) result = brightness < 02.0/17.0;
   	else if (x == 0 && y == 3) result = brightness < 01.0/17.0;
        
	return result;
}

mat2 rot(in float a) {
	return mat2(cos(a),sin(a),-sin(a),cos(a));	
}

// main distance function
float de(vec3 p) {
    
    float de = 0.0;
    
    de += length(p) - 5.0;
    
    de += (sin(p.x*3.0424+iTime * 1.9318)*.5+.5)*0.3;
    de += (sin(p.y*2.0157+iTime * 1.5647)*.5+.5)*0.4;
    
	return de;
} 

// normal function
vec3 normal(vec3 p) {
	vec3 e = vec3(0.0, 0.001, 0.0);
	return normalize(vec3(
		de(p+e.yxx)-de(p-e.yxx),
		de(p+e.xyx)-de(p-e.xyx),
		de(p+e.xxy)-de(p-e.xxy)));	
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    
    vec2 uv = fragCoord.xy / iResolution.xy * 2.0 - 1.0;
	uv.y *= iResolution.y / iResolution.x;
	
	vec3 from = vec3(-50, 0, 0);
	vec3 dir = normalize(vec3(uv*0.2, 1.0));
	dir.xz *= rot(3.1415*.5);
	
	vec2 mouse=(iMouse.xy / iResolution.xy - 0.5) * 0.5;
	if (iMouse.z < 1.0) mouse = vec2(0.0);
	
	mat2 rotxz = rot(iTime*0.0652+mouse.x*5.0);
	mat2 rotxy = rot(0.3-mouse.y*5.0);
	
	from.xy *= rotxy;
	from.xz *= rotxz;
	dir.xy  *= rotxy;
	dir.xz  *= rotxz;

	float mindist = 100000.0;
	float totdist = 0.0;
	bool set = false;
	vec3 norm = vec3(0);
	
	vec3 light = normalize(vec3(1.0, -3.0, 2.0));
	
	for (int steps = 0 ; steps < 100 ; steps++) {
		if (set) continue;
		vec3 p = from + totdist * dir;
		float dist = max(min(de(p), 1.0), 0.0);
        
        mindist = min(dist, mindist);
        
		totdist += dist;
		if (dist < 0.01) {
			set = true;
			norm = normal(p);
		}
	}
    
    if (set) {
       fragColor = vec4(vec3(getValue( dot(light, norm)*.5+.5, fragCoord)), 1.0);
    } else {
        // add an edge around the object
        if (mindist < 0.5) fragColor = vec4(vec3(0.0), 1.0);
        else {
            // do some whatever background with dithering as well
            
            vec2 pos = fragCoord - iResolution.xy * 0.5;
            
            vec2 dir = vec2(0.0, 1.0)*rot(sin(iTime*0.4545)*0.112);
            float value = sin(dot(pos, dir)*0.048-iTime*1.412)*0.5+0.5;
            
            fragColor = vec4(vec3(getValue(value, pos)), 1.0);
            
        }

    }
	

}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}