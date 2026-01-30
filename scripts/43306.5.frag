#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash( float n ){
    return fract(sin(n)*758.5453);
}


float noise3d( in vec3 x ){
    vec3 p = floor(x);
        vec3 f = smoothstep(0.0, 1.0, fract(x));
    float n = p.x + p.y*157.0 + 113.0*p.z;

    return mix(mix(	mix( hash(n+0.0), hash(n+1.0),f.x),
            mix( hash(n+157.0), hash(n+158.0),f.x),f.y),
           mix(	mix( hash(n+113.0), hash(n+114.0),f.x),
            mix( hash(n+270.0), hash(n+271.0),f.x),f.y),f.z);
}

float FBM2(vec2 p ){
    float a = 0.0;
        float w = 0.5;
    for(int i=0;i<3;i++){
        a += (noise3d(vec3(p, time)) * noise3d(123.5 + vec3(p, time))) * w;
            w *= 0.5;
        p *= 2.1;
    }
    return a;
}
uniform sampler2D bb;
vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
} 
float FBM2x(vec2 p ){
    float a = 0.0;
        float w = 0.5;
    for(int i=0;i<10;i++){
        a += texture2D(bb, fract(p)).a * w;
            w *= 0.7;
        p *= 2.5; 
	    
    }
    return a;
}
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) ;
	vec2 c1 = vec2(position.x, position.y);
	vec2 c2 = vec2(1.0 - position.x, position.y);
	vec2 c3 = vec2(position.x, 1.0 - position.y);
	vec2 c4 = vec2(1.0 - position.x, 1.0 - position.y);
	
	float color = FBM2(c1 * 31.0) + FBM2(c2 * 31.0) + FBM2(c3 * 31.0) + FBM2(c4 * 31.0);
	gl_FragColor = vec4(FBM2x((position * 0.3 + FBM2x(position * 0.3) * 0.02) + mouse * 8.0) * vec3(1.0), pow(color * 0.5, 2.0));

}