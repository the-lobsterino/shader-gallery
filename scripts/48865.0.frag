/*
	https://www.shadertoy.com/view/ltGyDD
*/
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

/* ------------------------------------ */
vec2 iResolution;
float iTime;

/* ------------------------------------ */
/*	ShaderToy Code			*/
/* ------------------------------------ */
#define R iResolution
#define T iTime
	
void setupColors(out vec3 colors[13]) {
    colors[0] = vec3(0.04, 0.14, 0.42);
    colors[1] = vec3(0.05, 0.50, 0.95); 
    colors[2] = vec3(0.36, 0.72, 0.68); 
    colors[3] = vec3(0.48, 0.46, 0.28); 
    colors[4] = vec3(0.69, 0.58, 0.27); 
    colors[5] = vec3(0.42, 0.51, 0.20); 
    colors[6] = vec3(0.23, 0.53, 0.16);
    colors[7] = vec3(0.06, 0.20, 0.07); 
    colors[8] = vec3(0.32, 0.33, 0.27); 
    colors[9] = vec3(0.25, 0.37, 0.41); 
    colors[10] = vec3(0.44, 0.67, 0.74);
    colors[11] = vec3(0.73, 0.86, 0.91);
    colors[12] = vec3(1.00, 1.00, 1.00);
}


float hash21(vec2 uv) {
	return fract(7856.54 * sin(dot(uv, vec2(5.56, 78.7))));
}

float noise(vec2 uv) {
    vec2 i = floor(uv);
    vec2 f = fract(uv);
    f = f * f * (3. - 2. * f);
    vec2 o = vec2(1., 0.);
	return  mix(
        mix(hash21(i + o.yy), hash21(i + o.xy), f.x),
        mix(hash21(i + o.yx), hash21(i + o.xx), f.x), f.y);
}
 
float fbm(vec2 uv) {
	float v = noise(uv);
    v += noise(uv * 2.) * .5;
    v += noise(uv * 4.) * .25;
    v += noise(uv * 8.) * .125;
    return v / 1.75;
}

void mainImage(out vec4 O, in vec2 I) {
 
    vec2 uv = (2. * I - R) / R.y;
   
 	// controlling range
  	float n = .1 + // mountains
        max(fbm(uv * 3. + T) - .2, 0.); // subtract - more ocean
    n =  n * n * (3. - 2. * n);
   
    
    vec3 color = vec3(n);
    
    vec3 colors[13];
    setupColors(colors);

   	color = colors[12]; // default white
    if (n < .95) color = colors[11]; // snow
    if (n < .825) color = colors[10]; // snowy rock
    if (n < .789) color = colors[9]; // mountain side
    if (n < .75) color = colors[8]; // moutain rocks
    if (n < .7) color = colors[7]; // forest
    if (n < .55) color = colors[6]; // grass
    if (n < .48) color = colors[5]; // marshy grass
    if (n < .47) color = colors[4]; // dry sand
    if (n < .45) color = colors[3]; // wet sand
    if (n < .43) color = colors[2]; // coral
    if (n < .4) color = colors[1]; // shallow water
    if (n < .38) color = colors[0]; // deep water
 
   
    O = vec4(color, 1.);
    
}


/* ------------------------------------ */
void main( void ) {
	iResolution = resolution;
	iTime = time;
	mainImage(gl_FragColor, gl_FragCoord.xy);
}