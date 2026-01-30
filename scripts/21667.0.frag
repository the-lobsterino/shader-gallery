// Blackbody Color Shader v3

// Written By: Nicholas Whitney

// Modification: Used alternate equations for color. Seems to be more accurate.

// Licensed and released under Creative Commons 3.0 Attribution
// https://creativecommons.org/licenses/by/3.0/

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float timeFactor = 30.;

// Temperature range in Kelvins from minTemp to maxTemp. 
// The equations are fitted to a minimum of 1,000 K and a maximum temp of 40,000K.
// The interesting range is 1,000 - 15,000K.

// Minimum temperature to represent.
float minTemp = 1000.;

// Maximum temperature to represent.
float maxTemp = 15000.;

float calcRed(float temp) {
	
	float red; 
	
	if ( temp <= 6600. ) {
		
		red = 1.;
	}
	else {
		temp = temp - 6000.;
		
		temp = temp / 100.;
		
		red = 1.29293618606274509804 * pow(temp, -0.1332047592);
		
		if (red < 0.) {
			red = 0.;
		}
		else if (red > 1.) {
			red = 1.;
		}
	}
	
	return red;
}

float calcGreen(float temp) {
	
	float green; 
	
	if ( temp <= 6600. ) {
		temp = temp / 100.;
		
		green = 0.39008157876901960784 * log(temp) - 0.63184144378862745098;
		
		if (green < 0.) {
			green = 0.;
		}
		else if (green > 1.) {
			green = 1.;
		}
	}
	else {
		temp = temp - 6000.;
		
		temp = temp / 100.;
	
		green = 1.12989086089529411765 * pow(temp, -0.0755148492);
		
		if (green < 0.) {
			green = 0.;
		}
		else if (green > 1.) {
			green = 1.;
		}
	}
	
	return green;
}

float calcBlue(float temp) {
	
	float blue;
	
	if ( temp <= 1900. ) {
		blue = 0.;
	}
	else if ( temp >= 6600.) {
		blue = 1.;
	}
	else {	
		temp = temp / 100.;
		
		blue = .00590528345530083 * pow(temp, 1.349167257362226); // R^2 of power curve fit: 0.9996
		blue = 0.54320678911019607843 * log(temp - 10.0) - 1.19625408914;
		
		if (blue < 0.) {
			blue = 0.;
		}
		else if (blue > 1.) {
			blue = 1.;
		}
	}
	
	return blue;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	float temp = minTemp + position.x * maxTemp;
	
	vec3 color = vec3(0.);
	
	if (position.y > .85) {
		color = vec3( calcRed(temp), 0., 0.);
	}
	else if (position.y > .7) {
		color = vec3( 0., calcGreen(temp), 0.);
	}
	else if (position.y > .55) {
		color = vec3( 0., 0., calcBlue(temp));
	}
	else if (position.y > .3) {
		color = vec3(calcRed(temp), calcGreen(temp), calcBlue(temp));
	}
	else {
		float calcTemp = mod(( time / timeFactor), 1.);
		temp = minTemp + calcTemp * maxTemp;
		
		color = vec3(calcRed(temp), calcGreen(temp), calcBlue(temp));
	}
	
	vec3 lineColor = vec3(0.);
	
	if ((position.x > mod((time / timeFactor), 1.)) && (position.x < mod((time / timeFactor) + (2. / resolution.x), 1.))) {	
		lineColor = vec3(1.);
	}
	
	if (position.y > 0.3){
		color += lineColor;
	}
	
	gl_FragColor = vec4( color , 1.0 );
	
}