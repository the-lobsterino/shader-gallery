#ifdef GL_ES
precision mediump float;
#endif

uniform vec2  resolution;
uniform float time;
uniform vec2 mouse;
float scale;


void main() {

	scale  = 8.0;
	vec2 pos =  vec2(gl_FragCoord.x /resolution.x, gl_FragCoord.y /resolution.x) ;
	pos.x -= 0.5;
	pos.y -= resolution.y * 0.5/resolution.x;
	pos *= scale;



	vec4 c;
	float d = 0.0;
	d = length(pos);
	float b = exp(-(d*d)) * (cos(20.0*d) + 1.0) / 2.0;
	c = vec4(b, b, b, 1.0);
	//c += length(pos - vec2(1.0,1.0));
	//c = scale;
	
	/*for(int i = 0; i < 1; i++)
	{
		vec2 t = vec2(0.5+ sin(time + float(i)) *0.25, float(i) * 0.05);
		float l = 1.0 - length( pos - t);
		l = pow(l, 16.0);
		c += l;
	}*/

	// c *= cos(2.0 * time);
	gl_FragColor = c;
}