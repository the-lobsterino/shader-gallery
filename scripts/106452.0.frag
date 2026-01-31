#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
/*
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}*/

precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
varying vec2 vUv;

void  mainImage( out vec4,  vec2 fragCoord );

void main () {
    vec4 outfrag;
    vec2 fragCoord = resolution * vUv;
    mainImage(outfrag, fragCoord);
    gl_FragColor = outfrag;
}

#define TAU 6.28318530718
#define MAX_ITER 5

void mainImage( out vec4 fragColor, in vec2 fragCoord ) 
{
	float vtime = time * 0.5 + 23.0;

	

    // uv should be the 0-1 uv of texture...
	vec2 uv = fragCoord.xy / resolution.xy;
    
    vec2 p = mod(uv * TAU, TAU) - 250.0;
	vec2 i = vec2(p);
	float c = 1.0;
	float inten = 0.005;

	for (int n = 0; n < MAX_ITER; n++) 
	{
		float t = vtime * (1.0 - (3.5 / float(n + 1)));
		i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
		c += 1.0 / length( vec2( p.x / ( sin( i.x + t ) / inten ), p.y / ( cos( i.y + t) / inten )));
	}
	c /= float(MAX_ITER);
	c = 1.17 - pow(c, 1.4);
	vec3 colour = vec3(pow(abs(c), 8.0));
    colour = clamp(colour + vec3(0.0, 0.35, 0.5), 0.0, 1.0);
    

	fragColor = vec4(colour, 1.0);
}