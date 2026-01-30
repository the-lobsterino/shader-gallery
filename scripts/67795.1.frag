precision mediump float;
uniform float time;
uniform vec2 mouse, resolution;
void main()
{
	gl_FragColor= vec4(.1, .18, .9, 1); 
	vec2 p = (gl_FragCoord.xy - .5 * resolution) / resolution.y;
	p = fract((mouse.x*3.)*p-vec2(.5))-.5;
	float c = mod(fract(cos(.5*time-p.y)+atan(p.x*length(p), p.y) / 1.57-.25*time), cos(.6*p.y)-.7);
	c = min(c, .5 / sqrt(p.x * p.x + p.y * p.y) - .998);
	gl_FragColor.xyz += .9-4.*c;
}