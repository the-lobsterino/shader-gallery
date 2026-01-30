#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Perlin noise function (adapted from: https://github.com/ashima/webgl-noise)
float noise( in vec3 x )
{
	vec3 p = floor(x);
	vec3 f = fract(x);
	f = f*f*(3.0-2.0*f);
	
	float n = p.x + p.y*157.0 + 113.0*p.z;
	return mix(mix(mix( fract(sin(n)*753.5453123), fract(sin(n+1.0)*753.5453123),f.x),
			mix( fract(sin(n+157.0)*753.5453123), fract(sin(n+158.0)*753.5453123),f.x),f.y),
			mix(mix( fract(sin(n+113.0)*753.5453123), fract(sin(n+114.0)*753.5453123),f.x),
			mix( fract(sin(n+270.0)*753.5453123), fract(sin(n+271.0)*753.5453123),f.x),f.y),f.z);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	
	float noiseScale = 2.0;
	float noiseSpeed = 2.0;

	// Add Perlin noise to the position
	vec3 noisePosition = vec3(position * noiseScale, time * noiseSpeed);
	float noiseValue = noise(noisePosition);

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 + noiseValue ) + cos( position.y * cos( time / 15.0 ) * 10.0 + noiseValue );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 + noiseValue ) + cos( position.x * sin( time / 25.0 ) * 40.0 + noiseValue );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 + noiseValue ) + sin( position.y * sin( time / 35.0 ) * 80.0 + noiseValue );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}