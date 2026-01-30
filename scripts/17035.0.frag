#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float w2 = resolution.x / 2.;
float h2 = resolution.y / 2.;

float zDepth = 2.4;
const float floorPos = 8., ceilPos =8.;

vec3 campos = vec3(0, 0, 0);

void main( void ) {
	
	float si = sin(time);
	float co = cos(0.);
	
	campos.y = 0. + sin(time*10.)*1.;
	
	float width = resolution.x;
	float height = resolution.y;
	float x = gl_FragCoord.x;
	float y = gl_FragCoord.y;
	float ceiling = (y + -height / zDepth) / height;
	float z = ((floorPos + campos.y) / ceiling);
			
	float ydist = (resolution.y * zDepth) / 5.7 - y;
			
	if(ceiling < 0.){
		z = (ceilPos - campos.y) / -ceiling;
	}
	
	float p = x + y * width;
	float depth = (x -  w2) / height;
	depth *= z;
	float xx = depth * co + z * si;
	float yy = z * co - depth * si;
	float xPix = (xx + time*10.);
	float yPix = (yy + sin(time)*10.);
			
	float  color = mod(xPix, 16.) + mod(yPix, 16.) * 8.;
	gl_FragColor = vec4(mod((color / 65536.), 256.), mod((color / 256.), 256.), mod(color, 256.), 0.);
			
	if(ydist < 10. && ydist > -10.) gl_FragColor -= mod(ydist+10.,10.)/40.;
}