precision highp float;
uniform vec2 resolution;
uniform float time;


void main()
{
	float size = max(resolution.x, resolution.y) * ( (sin(time) * .045) + 0.12) ;
	int p = int(gl_FragCoord.x / size + sin(time*1.0)) + int(gl_FragCoord.y / size + (time*2.0) );
	gl_FragColor += float(p - 2 * (p / 2)); 
}