#extension GL_OES_standard_derivatives : enable

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 resolution;
uniform float time;

vec3 colorA = vec3(0.5,0.,0.);
vec3 colorB = vec3(0.,0.,0.5);

float line (vec2 st, float pct){
  return  smoothstep( pct-0.005, pct, st.y) -
          smoothstep( pct, pct+0.005, st.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/resolution;
    vec3 color = vec3(0.0);

// Fonction des 3 canaux réunis
	
     vec3 pct = vec3(pow(st.x,2.));


	// vec3 pct = vec3(pow(st.x,Y));
	// vec3 pct = vec3(exp(st.x));
	  pct = vec3(log(st.x));
	// vec3 pct = vec3(sqrt(x));
	// vec3 pct = vec3(sign(x));
	// vec3 pct = vec3(abs(x));
	// vec3 pct = vec3(floor(x));
	// vec3 pct = vec3(ceil(x));
	// vec3 pct = vec3(fract(x));
	// vec3 pct = vec3(mod(x,Y));
	// vec3 pct = vec3(min(x,Y));
	// vec3 pct = vec3(max(x,Y));
	// vec3 pct = vec3(clamp(x,minVal,maxVal));
	// vec3 pct = vec3(sin(ANGLE));
	// vec3 pct = vec3(cos(ANGLE));
	// vec3 pct = vec3(tan(ANGLE));
	// vec3 pct = vec3(asin(x));
	// vec3 pct = vec3(acos(x));
	// vec3 pct = vec3(atan(x));
	
	
	
 // Fonction de la ligne correspondante à chaque canal
	
    // pct.r = smoothstep(0.,1.0, st.x+.1); //R
    // pct.g = smoothstep(0.,1.0, st.x); //V
    // pct.b = smoothstep(0.,1.0, st.x-.1); //B
	
    color = mix(colorA, colorB, pct);

 // Trace la ligne de transition pour chaque canal
	
    color = mix(color,	vec3(1.0,0.8,0.8),  line(st,pct.r));
    color = mix(color,	vec3(0.8,1.0,0.8),  line(st,pct.g));
    color = mix(color,	vec3(0.8,0.8,1.0),  line(st,pct.b));
	
	

    gl_FragColor = vec4(color,1.0);
}