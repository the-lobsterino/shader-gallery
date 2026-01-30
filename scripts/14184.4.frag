#ifdef GL_ES
precision mediump float;
#endif
//HSV STI 11/02/2014

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float PI=3.141516;
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 DrawCircle(vec2 pos){
	vec3 paintColor=vec3(0.2,0.2,0.2);
	vec2 center= vec2(0.8,0.4);//vec2(resolution.x/2.0,resolution.y/2.0);
	
	float dist=distance(pos,center);
	float radius=0.3+sin(time)*0.2;
	
	vec2 delta=vec2(pos.x-center.x,pos.y-center.y);
	
	float angle= ((atan(delta.x, delta.y) )*0.16)+time/PI;
	
	if(dist<radius){
		vec3 hsvValues = vec3(angle,sqrt(dist/radius),1./sqrt(dist+radius));
		paintColor= hsv2rgb(hsvValues);
	}
			
	return paintColor;
	 
}
void main( void ) {
	vec2 aspect=vec2(1.6,0.8);
	vec2 position = ( gl_FragCoord.xy / resolution.xy )*aspect;		
	vec3 color=DrawCircle(position);		
	gl_FragColor = vec4( color, 1.0 );
}