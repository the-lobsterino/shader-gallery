#ifdef GL_ES
precision mediump float;
#endif
//Playing with GLSL in school
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define PI 3.1415926535897932384
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec2 rotation(in float angle,in vec2 position,in vec2 center)
{
    //Function seen from https://www.shadertoy.com/view/XlsGWf
    float rot = radians(angle);
    mat2 rotation = mat2(cos(rot), -sin(rot), sin(rot), cos(rot));
    return vec2((position-center)*rotation);
}

vec2 scale(vec2 pos, float size, vec2 center)
{
 	return vec2((pos-center)*size);   
}
void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	vec2 uv3 = rotation(time*40.,uv-0.5,vec2(0.))+0.5;
	float atanr = (atan(uv3.x-0.5,uv3.y-0.5)+PI)/(PI*2.);
	
	vec2 uv2 = floor(uv*50.)/50.;
	float wave = sin((time+uv2.y+uv2.x)*4.)*0.07;
	vec3 rainbow = hsv2rgb(vec3(uv2.x+time+wave,1.,1.));
	float circle = 1.-clamp( (length(uv- /*position*/ vec2((asin(sin(time*0.7))/6.)+0.5,abs(sin(time))/1.5+0.1)) /*size*/ -0.1) /*sharpness*/ *200.,0.,1.);
	rainbow = floor(rainbow*3.)/3.;
	float circle2 = 1.-clamp( (length(uv- /*position*/ vec2((asin(sin(time*0.7))/6.)+0.5,abs(sin(time))/1.5+0.1)) /*size*/ -0.08) /*sharpness*/ *200.,0.,1.);
        float test = floor(fract(atanr*20.)+0.5)-length(uv-0.5);
	
	vec3 colors = rainbow+circle-(circle2*2.);
	gl_FragColor = vec4(colors+test, 1.0 );

}