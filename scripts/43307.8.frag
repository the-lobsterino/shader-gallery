#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec2 UV;

float point(vec2 coord){
	return 3.0 * 1.0 / pow(0.01 + distance(coord, UV)*300.0, 2.8);
}
float hash( float n ){
    return fract(sin(n)*758.5453);
}
vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
} 

varying vec2 surfacePosition;
float A = 0.15;
float B = 0.50;
float C = 0.10;
float D = 0.20;
float E = 0.02;
float F = 0.30;
float W = 11.2;

vec3 Uncharted2Tonemap(vec3 x) {
   return ((x * (A * x + C * B) + D * E) / (x * (A * x + B) + D * F)) - E / F;
}

//Based on Filmic Tonemapping Operators http://filmicgames.com/archives/75
vec3 tonemapUncharted2(vec3 color) {
    float ExposureBias = 2.0;
    vec3 curr = Uncharted2Tonemap(ExposureBias * color);

    vec3 whiteScale = 1.0 / Uncharted2Tonemap(vec3(W));
    return curr * whiteScale;
}
void main( void ) {

	UV = surfacePosition * 0.5 + 0.5;

	vec3 color = vec3(0.0);
	float seed = 0.0;
	for(int i=0;i<3000;i++){
		float lu = hash(seed);
		seed += 100.0;
		float x = hash(seed);
		seed += 100.0;
		float y = hash(seed);
		seed += 100.0;
		vec2 c = vec2(x, y);
		float dst = distance(vec2(0.5), c);
		lu = pow(lu, 0.1 + dst * 13.0);
		c = c * 2.0 - 1.0;
		c = rotate(pow(c, vec2(3.0)), length(c) * 8.12345678);
		seed += 100.0;
		c = c * 0.5 + 0.5;
		
		float r = hash(seed);
		seed += 100.0;
		float g = hash(seed);
		seed += 100.0;
		float b = hash(seed);
		seed += 100.0;
		color += vec3(r,g,b) * lu * point(c);	
	} 
	color += hash(UV.x + UV.y * 100.0) * (1.0/128.0);
	gl_FragColor = vec4( tonemapUncharted2( color ), 1.0 );

}