#ifdef GL_ES
precision mediump float;
#endif

// Not fully functional perlin noise

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float cnoise( vec3 coord );
float surface3( vec3 coord );

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	/*float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;*/
	
	float noise = cnoise( vec3(position, time * 0.05) * 4.0 ) * 0.5 + 0.5;
	gl_FragColor = mix(vec4(0.0, 0.0, 0.0, 1.0), vec4(1.0, 1.0, 1.0, 1.0), noise);
	
	// gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float fade( float x ) {
	return x*x*x*(3.0*x*(2.0*x-5.0)+10.0);
}

vec3 rand( int i, int j, int k ) {
	return vec3(
		rand(vec2(i, j)),
		rand(vec2(j, k)),
		rand(vec2(k, i))
	);
}

float cnoise( vec3 coord ) {
	int i = int(floor(coord.x));
	int j = int(floor(coord.y));
	int k = int(floor(coord.z));
	
	float fx = coord.x - float(i);
	float fy = coord.y - float(j);
	float fz = coord.z - float(k);
	
	vec3 g000 = rand(i+1, j  , k  );
	vec3 g001 = rand(i+1, j  , k+1);
	vec3 g010 = rand(i+1, j+1, k  );
	vec3 g011 = rand(i+1, j+1, k+1);
	vec3 g100 = rand(i  , j  , k  );
	vec3 g101 = rand(i  , j  , k+1);
	vec3 g110 = rand(i  , j+1, k  );
	vec3 g111 = rand(i  , j+1, k+1);
	
	float n000 = dot(g000, vec3(fx    , fy    , fz    ));
	float n001 = dot(g001, vec3(fx    , fy    , fz-1.0));
	float n010 = dot(g010, vec3(fx    , fy-1.0, fz    ));
	float n011 = dot(g011, vec3(fx    , fy-1.0, fz-1.0));
	float n100 = dot(g100, vec3(fx-1.0, fy    , fz    ));
	float n101 = dot(g101, vec3(fx-1.0, fy    , fz-1.0));
	float n110 = dot(g110, vec3(fx-1.0, fy-1.0, fz    ));
	float n111 = dot(g111, vec3(fx-1.0, fy-1.0, fz-1.0));
	
	fx = fade(fx);
	fy = fade(fy);
	fz = fade(fz);
	
	return mix(mix(mix(n000, n001, fx), mix(n010, n011, fx), fy),
		   mix(mix(n100, n101, fx), mix(n110, n111, fx), fy), fz);
}

float surface3( vec3 coord ) {
	float result = 0.0;
	float amp = 1.0;
	float freq = 4.0;
	float totalAmp = 0.0;
	for (int i = 0; i < 8; i++) {
		result += abs(cnoise(coord * freq)) * amp;
		totalAmp += amp;
		amp *= 0.5;
		freq *= 2.0;
	}
	return result / totalAmp;
}
