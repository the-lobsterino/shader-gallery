
precision mediump float;


uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
varying vec2 surfacePosition;

void main(){
	vec2 pos = surfacePosition;

	const float pi = 3.14159;
	const float n = 16.0;
	float g =min(resolution.x,resolution.y);
	float radius = 3./inversesqrt( (pos.x*pos.x)+(pos.y*pos.y) ) - 1.2;
	float t = atan(pos.y,pos.x )/pi-3.*cos(pos.x*pos.y-time*.21);
	
	float color = 0.0;
	color += 0.083/abs(0.2*sin(time+float(int(mouse.y*10.))*pi*(t))- radius - mouse.x * 2. + sin(time * 8.) * 0.03);

	gl_FragColor = 1./radius*-g/666.*-vec4(vec3(radius ,cos(time)*.5,1.5)* color  , color);
		
}