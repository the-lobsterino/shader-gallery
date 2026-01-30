#extension GL_OES_standard_derivatives : enable

precision mediump float;
//nis_practise
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



vec2 hash(vec2 p){
	vec2 q = vec2(dot(p,vec2(143.18,115.1)),
		     dot(p,vec2(153.23,156.52)));
	
	return fract(sin(q)*134.165)*sin(time*1.5+q)+.5;
}



vec3 voronoi(vec2 uv){
	vec2 id = floor(uv);
	vec2 f = fract(uv);
	
	vec2 a = vec2(0);
	for(int i=-2;i<=2;i++){
		for(int j=-2;j<=2;j++){
			vec2 g = vec2(i,j);
			vec2 o = hash(id+g);
			vec2 d = g - f + o;
			float w = pow(smoothstep(1.2,0.,length(d)),3.);
			a+=vec2(o.x*w,w);
		}
	}
	return (a.x/a.y)-vec3((f+id)/9.*abs(sin(time*0.3))+.9,.7);
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy/ resolution.xy );
	uv.x*=resolution.x/resolution.y;
	vec3 col = vec3(1.0);
	
	//float c = voronoi(uv*25.);
	vec3 cc = voronoi(uv*1000.);
	col = vec3(cc);
	gl_FragColor = vec4(col, 9.0 );

}