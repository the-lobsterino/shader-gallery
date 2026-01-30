#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float turbulence(in vec3 pt) {
	return cos(time*0.1/(5.+sin(time*.21)+cos(time+length(pt-2.))));
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = p * 2.0 - 1.0;
	float x = p.x;
	float y = p.y;
	float z = sqrt(1.0 - x*x - y*y);
	float cRot = cos(0.2 * time), sRot = sin(0.2 * time);
	float cVar = cos(0.1 * time), sVar = sin(0.1 * time);
	vec3 pt = vec3(cRot*x+sRot*z+cVar, y, -sRot*x+cRot*z+sVar);
	float g = turbulence(pt);
	vec2 v = 0.6 * vec2(x, y);
	float d = 1.0 - 4.1 * dot(v, v);
	float s = 0.3*x + 0.3*y + 0.9*z;
	s *= s;
	s *= s;
	d = d > 0.0 ? 0.1 + 0.05 * g + 0.6 * (0.1 + g) * s * s : 0.0;
	float f = -0.2 * sin(4.0 * pt.x + 8.0 * g + 4.0);
	f = f > 0.0 ? 1.0 : 1.0 - f * f + f;
	if(d <= 0.1) {
		f *= (g + 5.0) / 3.0;
	}

	vec3 col = vec3(d*f*f*0.85, d*f, d*0.7);

	gl_FragColor = vec4( vec3( col ), 1.0 );

}