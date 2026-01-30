// settings for customization. please consider each setting will change something in the display. just change the numbers below for the setting you want to change.
// but also you need to have a . after the number for example: #.#
// anyways have fun tinkering!


//size, {to make it bigger subtract from the number, to make it smaller and show more waves, add to the number, default is 8.}
#define scale 5.
//speed, {I'd recommend keeping this setting between [5-100] (562.5 looks trippy lol) youll see why when you increase it}
#define speed 50.
//wave count;
#define ray 15.
//ray intesity
#define intensity 0.5
//if values{
//mouse follow; to make the mouse stop / begin following the cursor do these following instructions: follow: replace the 1 with "mouse.xy", 
//dont follow: replace the 1 with 0.7
#define f 0.7
//}
//experimental unnamed settings;
#define unknown 1.
#define unknow 1.
#define unkno 8.
#define unkn 5. //for unkn 5 makes it looks pretty satisfying when everything is how it is now.

































/// stuff
#define tau 6.28318530718
#define res resolution
#define inv( x ) ( 1. / ( x ) )
#define rot( a ) mat2( cos( a ), -sin( a ), sin( a), cos( a ) )
precision highp float;
uniform float time;
uniform vec2  mouse;
uniform vec2 resolution;
#define time time*(speed/50.)


#extension GL_OES_standard_derivatives : enable
#define n 0

void main( void ) {
	vec2 uv = (gl_FragCoord.xy - resolution * f) / max(resolution.x*unkn, resolution.y) * scale;

	vec2 pos = mouse.xy;
	vec2 position = gl_FragCoord.xy / resolution.xy;
	float t = 0.255 / abs(abs(sin(1.)) - length(uv));
	uv *= 1.0;
	
	float e = 0.25;
	for (float i=1.0;i<=(ray);i+=1.0) {
	e += 0.05*(intensity)/abs( (i/15.) +sin((time/2.0)*(unkno) + 0.15*i*(uv.x) *( cos(i*(unknow)/4.0 + (time * 5.0) + uv.x*2.2) ) ) + 2.5*(unknown)*uv.y);
	
	gl_FragColor = vec4( vec3(e/19.5, e/19.5, e/1.5), 1.6);	
	//gl_FragColor.r = 1.0;
	gl_FragColor.g = mouse.x / 15.0 + 0.128;
	//gl_FragColor.b = uv.y / 1.0 + 0.25;
	gl_FragColor.a = uv.y + 2.4;
	}
	
}