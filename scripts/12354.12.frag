//EGK696 GL-LIGHTSABER
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

vec3 red_light = vec3(0.5, 0.01, 0.01);
vec3 green_light = vec3(0.01, 0.5, 0.01);
vec3 blue_light = vec3(0.01, 0.01, 0.5);
void drawLightSaber1(vec2 p, float angle, vec3 color){
	//p.x += p.x*cos(angle)-p.y*sin(angle);
	//p.y += p.y*cos(angle)-p.x*sin(angle);
	float s = sin(time*4.);
	if(p.x >=-0.009 && p.x<=0.009 && p.y >= -0.1 && p.y <= 0.25){
		float dx1 = 1. / (360. * abs(p.x));
		float dx2 = (720. * abs(p.x));
		float dy = 1. / (360. * abs(p.y));
		if(color.x > color.y && color.x > color.z){
			color.x *= (dx1/dx2);
			color.y /= dx2;
			color.z /= dx2;
		} else if(color.y > color.x && color.y > color.z){
			color.x /= dx2;
			color.y *= (dx1/dx2);
			color.z /= dx2;
		} else {
			color.x /= dx2;
			color.y /= dx2;
			color.z *= (dx1/dx2);
		}
    		gl_FragColor = vec4(color, 0.9);
	}
	else if(p.x >=-0.007 && p.x<=0.007 && p.y >= -0.2 && p.y <= -0.1){
		float dx = 1. / (180. * abs(p.x));
		float dy = 1. / (60. * abs(p.y));
		gl_FragColor = vec4(0.3*dx*dy, 0.3*dx*dy, 0.3*dx*dy, 1.0);	
	}
	else{
		return;
	}	
}

void main( void ) {
	vec2 p1 = ( gl_FragCoord.xy / resolution.xy ) - 0.5;	
	drawLightSaber1(p1, 45., red_light);
	vec2 p2 = p1;
	p2.x +=0.1;
	drawLightSaber1(p2, 45., blue_light);
	vec2 p3 = p1;
	p2.x = p1.x - 0.1;
	drawLightSaber1(p2, 45., green_light);
}