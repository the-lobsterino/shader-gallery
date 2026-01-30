#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int LAYERS = 20;

/**
* Another parallax shader by Jaksa
*/

/**
* true if we hit the layer
*/
bool contour(vec2 p) {
	return p.y < sin(p.x*5.0)*.2;
}

/*
* the colour of the layer at this point
*/
vec3 col(vec2 p) {
	float contourShadow = clamp(7.*(sin(p.x*5.0)*.2 - p.y), 0.0, 1.0);
	return clamp(contourShadow*vec3(sin(p.x*2.0)*0.9+1.0-p.y*3.0, 0.5, 0.3), 0.0, 1.0);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;

	vec3 colour = vec3(0.0);
	
	for (int i = 0; i < LAYERS; i++) {
		float fi = float(i);
		float z = 100.0 - fi*(100.0/float(LAYERS));
				
		z = max(0.0, z - fract(time)*(100.0/float(LAYERS))); // can't get the smooth animation here
		
		vec2 p = position*z + fi/20.0;
		//p.x+=sin(time/10.0)*50.0;
		
		vec3 levelCol = col(p);
		if (contour(p)) colour = levelCol * pow(z, -.6);
	}

	gl_FragColor = vec4(colour, 1.0 );
}

