//Trails by Natspir

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
float speed = 10.;

float Random(vec2 uv){
	vec2 seed = vec2(15.315531,65.2354);
	return fract(sin(dot(uv,seed))*315351.351351)*3.0-1.5;
}

float Noise(vec2 uv){
	vec2 uv_i = floor(uv);
	vec2 uv_f = fract(uv);
	
	float a = Random(uv_i);
	float b = Random(uv_i+vec2(1.0,0.0));
	float c = Random(uv_i+vec2(0.0,1.0));
	float d = Random(uv_i+vec2(1.0,1.0));
	vec2 u = uv_f*uv_f*(3.0-2.0*uv_f);
	return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;
}
//Thanks to Patricio Gonzalez
float FBM(vec2 uv){
	
	float val = 0.0;
	float freq = 2.50;
	float amp = 0.5;
	for(int i=0;i<6;i++){
		val+=abs(Noise(uv))*amp;
		uv*=freq;
		amp *=0.5;
	}
	val= clamp(val,0.0,1.0);
	return val;
}

void main( void ) {
	vec2 pos = ( gl_FragCoord.xy / resolution.xy );
	//fbm
	float f = FBM(pos*10.0+vec2(time*0.5,0.0));
	f = FBM(pos*2.0+f-time*0.05);
	float mixerVal = 0.55;
	float valSoft = 0.6;
	float mixer = smoothstep(mixerVal-valSoft,mixerVal+valSoft,1.0-pos.x)*2.0-1.0;
	//f*=mixer;
	f+=mixer;//1.0-(pos.x+.42);
	float maskVal = 0.5;
	float maskSoft = 0.3;
	float mask = smoothstep(maskVal-maskSoft,maskVal+maskSoft,1.0-abs(pos.y*2.0-1.0));
	gl_FragColor = vec4(mask*f);
}