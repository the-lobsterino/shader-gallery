precision highp float;

uniform vec2 resolution;

void main( void )
{
	vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
	vec3 color = vec3(1.,1.,1.);
	vec3 WL = vec3((p.x*.5+.5) * (750.-380.) + 380.);
	vec3 centerWL = vec3(580.,540.,440.);
	vec3 widthWL = vec3(90.,80.,80.);
	vec3 w = (WL - centerWL)/widthWL;
	color = exp(-w*w);
	gl_FragColor = vec4(color, 1.);
}