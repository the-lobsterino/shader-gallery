// Shader by Nicolas Robert [NRX]
// Latest version: http://glsl.heroku.com/e#14662
// Ancestor of http://glsl.heroku.com/e#16679

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
varying vec2 surfacePosition;

void main () {
	vec3 col = vec3(0.0);
	vec2 p = surfacePosition*(6.+sin(time/8.)*5.5);
	float t = time-(log(length(p)*length(p)));
	for(float i=1.; i<12.; i+=1.)
	{
        	float fac = pow(2.,i);
	
		t/=sqrt(fac); 
		vec2 pos =  (sin(p*fac)*(1.+sin(t)));
		float d2D = 1.0 / length (pos*(2.)) + t/(fac*i);
		float a2D = (atan (pos.y, pos.x) + sin (t * 0.2) * 3.14159)+(log(length(pos)*sin(d2D+t)))*sin(t/fac)*3.;
		col += (vec3(0.5 + sin (d2D * 8.0) * 0.5, 0.5 + sin (a2D * 8.0) * 0.5, 0.5 + sin (d2D * 4.0) * sin (a2D * 4.0) * 0.5)/(3./length(pos)+1.))/(fac/i);
	}
	
	
	gl_FragColor = vec4 (col, 1.0);
}