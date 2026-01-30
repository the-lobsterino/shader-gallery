#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(float st){
	return fract(sin(st)*416854.16851);
}

float rand(vec2 st){
	return fract(sin(dot(st.xy,vec2(12.311634,91.4156846)))*416854.16851);
}

float rand(vec3 st){
	return fract(sin(dot(st.xyz,vec3(12.311634,91.4156846,34.18646)))*416854.16851);
}

float perlin(float st){
	float i = floor(st);
	float f = fract(st);
	return mix(rand(i), rand(i+1.), smoothstep(0.,1.,f));
}

float perlina(vec2 inp,float layer){
	vec2 st = inp/layer;
	vec2 i = floor(st);
	vec2 f = fract(st);
	float a = rand(i);
	float b = rand(i+vec2(1.,0.));
	float c = rand(i+vec2(0.,1.));
	float d = rand(i+vec2(1.,1.));
	float top = mix(a,b,smoothstep(0.,1.,f.x));
	float bot = mix(c,d,smoothstep(0.,1.,f.x));
	return mix(top,bot,smoothstep(0.,1.,f.y));
}
float perlina(vec3 inp,float layer){
	vec3 st = inp/layer;
	vec3 i = floor(st);
	vec3 f = fract(st);
	float ltf = rand(i);
	float ltb = rand(i+vec3(0.,0.,1.));
	float lbf = rand(i+vec3(0.,1.,0.));
	float lbb = rand(i+vec3(0.,1.,1.));
	float rtf = rand(i+vec3(1.,0.,0.));
	float rtb = rand(i+vec3(1.,0.,1.));
	float rbf = rand(i+vec3(1.,1.,0.));
	float rbb = rand(i+vec3(1.,1.,1.));
	float tf = mix(ltf,rtf,smoothstep(0.,1.,f.x));
	float tb = mix(ltb,rtb,smoothstep(0.,1.,f.x));
	float bf = mix(lbf,rbf,smoothstep(0.,1.,f.x));
	float bb = mix(lbb,rbb,smoothstep(0.,1.,f.x));
	float front = mix(tf,bf,smoothstep(0.,1.,f.y));
	float back = mix(tb,bb,smoothstep(0.,1.,f.y));
	return mix(front,back,smoothstep(0.,1.,f.z));
}
float perlina(vec3 st){
	vec3 i = floor(st);
	vec3 f = fract(st);
	float ltf = rand(i);
	float ltb = rand(i+vec3(0.,0.,1.));
	float lbf = rand(i+vec3(0.,1.,0.));
	float lbb = rand(i+vec3(0.,1.,1.));
	float rtf = rand(i+vec3(1.,0.,0.));
	float rtb = rand(i+vec3(1.,0.,1.));
	float rbf = rand(i+vec3(1.,1.,0.));
	float rbb = rand(i+vec3(1.,1.,1.));
	float tf = mix(ltf,rtf,smoothstep(0.,1.,f.x));
	float tb = mix(ltb,rtb,smoothstep(0.,1.,f.x));
	float bf = mix(lbf,rbf,smoothstep(0.,1.,f.x));
	float bb = mix(lbb,rbb,smoothstep(0.,1.,f.x));
	float front = mix(tf,bf,smoothstep(0.,1.,f.y));
	float back = mix(tb,bb,smoothstep(0.,1.,f.y));
	return mix(front,back,smoothstep(0.,1.,f.z));
}

float perlin(vec2 st){
	float ou = 0.;
	for(float i = 0.; i >= 2.; i++){
		float x = pow(2.,i);
		ou+=perlina(vec3(st/x,x),1.);
	}
	return ou;
}

void main( void ) {

	/*vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;*/

	float ma = 6.;
	float col = 0.;
	for(float i = 1.; i <= 6.; i++){
		col -= perlina(vec3(gl_FragCoord.xy/pow(2.,ma-i),i*(100.+time)))/pow(2.,i);
	}
	gl_FragColor = vec4( col,col,col, 1.0 );

}