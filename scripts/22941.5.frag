#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
varying vec2 surfacePosition;
float MouseSmoothGamma = .05;//1.9+0.2*cos(time*1.9);
uniform sampler2D MouseData;
vec2 GetSmoothMouse(void){
	return vec2(
		texture2D(MouseData, vec2(0.)).x,
		texture2D(MouseData, vec2(0., resolution.y)).x
	);
}
void SetSmoothMousePlus(void){
	if(gl_FragCoord.x+gl_FragCoord.y <= 8.){
		float oldeX = GetSmoothMouse().x;
		
		gl_FragColor.x = oldeX * (1.-MouseSmoothGamma) + mouse.x * MouseSmoothGamma;
	}else
	if(gl_FragCoord.x+(resolution.y-gl_FragCoord.y) <= 8.){
		float oldeY = GetSmoothMouse().y;
		gl_FragColor.x = oldeY * (1.-MouseSmoothGamma) + mouse.y * MouseSmoothGamma;
	}else{
		MouseSmoothGamma = pow(MouseSmoothGamma, 0.333);
		gl_FragColor *= MouseSmoothGamma;
		gl_FragColor += (1.-MouseSmoothGamma)*texture2D(MouseData, gl_FragCoord.xy/resolution);
	}
}
void main( void ) {

	vec2 position = (( gl_FragCoord.xy / resolution.xy ) - 0.5) * 2.5;
	position.x *= (resolution.x / resolution.y);
	
	vec3 color = vec3(0.0, 0.0, 0.0);
	
	float zx = position.x;
	float zy = position.y;
	float zxsq = zx * zx;
	float zysq = zy * zy;
	vec2 sm = GetSmoothMouse();
	float cx = sm.x * 2.0 - 1.0;
	float cy = sm.y * 2.0 - 1.0;
	
	for(int i = 0; i < 100; i++)
	{
		zy = 2.0 * zx * zy + cy;
		zx = zxsq - zysq + cx;
		zxsq = zx * zx;
		zysq = zy * zy;
		
		if(zxsq + zysq > 4.0)
		{
			float fI = float(i) + 1.0 - log(log(sqrt(zxsq + zysq)) / log(2.0)) / log(2.0);
			color = vec3((-cos(fI * 0.38) - 0.5) * 2.0, (-cos(fI * 0.08) - 0.5) * 2.0, (-cos(fI * 0.24) - 0.5) * 2.0);
			break;
		}
	}
	
	gl_FragColor = vec4(color, 1.0);
	SetSmoothMousePlus();
}