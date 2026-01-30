#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

// Created by Stephane Cuillerdier - @Aiekick/2016
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// Tuned via XShade (http://www.funparadigm.com/xshade/)
// based on https://www.shadertoy.com/view/XdKGRD
// original clickable : https://www.shadertoy.com/view/XdG3zm

// count radial section
#define sections 8. 
#define startColor vec3(1,0.26,0)
#define endColor vec3(0.33,0.2,0.49)

// screen coord zoom
#define zoom 1.27 

// if of central section
#define neutralSection 5. 

// radius of neutral zone (in center) wich show the neutralSection id
#define neutralZone 0.5 

vec3 GetHexPattern(vec2 uv, vec4 v, vec3 k) 
{
    	float a = atan(uv.x, uv.y)/3.14159*floor(k.y); 
	float r = length(uv)*4.; 
	uv = vec2(a,r);// polar uv
    
    	uv.x *= floor(uv.y)-k.x; //along r with alternance
	uv.x += time ; // rotate each radius offset with constant speed
    
    	vec3 color = mix(startColor, endColor, vec3(floor(uv.y)/4.));
    
    	uv = abs(fract(uv)-0.5);
    
	return color / (abs(max(uv.x*v.x + uv.y*v.y,uv.y*v.z) - v.w)*k.z);
}

vec2 GetUV(vec2 s, vec2 h, float z) 
{
	return z * (h+h-s)/s.y; // central uv
}

float GetID(vec2 s, vec2 h) 
{
	vec2 uv = GetUV(s, h, zoom);
	float a = 0.;
	if (uv.x >= 0.) a = atan(uv.x, uv.y);
    if (uv.x < 0.) a = 3.14159 - atan(uv.x, -uv.y);
	a = ceil(a *  (floor(sections)*0.5)/3.14159);
	float r = length(uv);
    return ( r < neutralZone ? neutralSection : a);
}

void main()
{
	vec2 pos = gl_FragCoord.xy;
    
	vec2 uv = GetUV(resolution.xy, pos, zoom);
	
	float cellID = GetID(resolution.xy, pos);

	vec4 p = vec4(0); // hex width, hex height, hex height limit, hex scale  
	
	vec3 k = vec3(-.3, 5, 4); // Alternance, Density, Glow

	if (cellID == 1.) {p = vec4(1.2,0.92,1.88,0.8);}
	if (cellID == 2.) {p = vec4(2.2,0,1.88,0.8);}
	if (cellID == 3.) {p = vec4(2.2,0,4,0.8);}
	if (cellID == 4.) {p = vec4(1,0,4,0.8);}
	if (cellID == 5.) {p = vec4(0.27,1.27,0.27,0.27);}
	if (cellID == 6.) {p = vec4(4,4,1,0.8);}
	if (cellID == 7.) {p = vec4(1,2.96,4,0.8);}
	if (cellID == 8.) {p = vec4(1.5,0.96,1.8,0.4);}
	//if (cellID == 9.) {p = vec4(1.2,2.24,0,0.68);}
	
	// refuse to save if i uncomment this ..... wtf ?
	
	vec3 hexPattern = GetHexPattern(uv, p, k);
	
	vec3 col = clamp(hexPattern, 0., 1.); // intensity limit for glow
	   
	gl_FragColor = vec4(col, 1);
}