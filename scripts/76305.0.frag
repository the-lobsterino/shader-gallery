#extension GL_OES_standard_derivatives : enable

precision mediump float;
//nis_practise
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash(vec2 p)  
{
    p  = 50.0*fract( p*0.3083099 + vec2(0.71,0.113));
    return -.1+fract( p.x*p.y*(p.x+p.y) );
} 

float noise(vec2 p){
	vec2 i = floor(p);
	vec2 f = fract(p);
	
	vec2 u = f*f*3.0*f*f*f;
	
	return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),u.x),
		mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x),u.y);
}

float fbm(vec2 uv){
	float f = 0.0;
	f += 0.5000*noise( uv ); uv*=1.0;
	f += 0.2500*noise( uv ); uv*=2.5;
	f += 0.1250*noise( uv ); uv*=1.9;
	f += 0.0625*noise( uv ); uv*=2.2;
	return f;
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) ;
	uv.x*=resolution.x/resolution.y;
	uv*=2.;
	vec3 col = vec3(1.);
	vec2 p = vec2(1.2,1.1);
	vec2 p2 = vec2(3.2,1.1);
	p.x+=sin(uv.x*5.+time*16.)*0.05*sin(time*0.654)*sin(time*3.156)*2.5;
	p.y+=sin(uv.y*24.+time*3.345)*0.02*sin(time*0.654)*sin(time*3.156)*2.0;
	uv.x*=1.3;
	float f = fbm(vec2(uv.x,uv.y-time*1.4)*10.);
	float d = smoothstep(0.8,0.01,length(uv-p));
	float d2 = smoothstep(0.8,0.01,length(uv-p2));
	col*=d*f;
	col*=vec3(.9,.5,.9)*2.;
	col+=vec3(1.,.4,.8)*f*d*3.;
	col+=d2*f*vec3(.1,.6,.5)*2.;;
	col+=vec3(.1,.3,1.)*f*d2*3.;
	gl_FragColor = vec4( col, 9.0 );

}