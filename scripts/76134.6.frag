#extension GL_OES_standard_derivatives : enable

precision mediump float;
//nis_shape_test
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 rot(float angle){
	return mat2(cos(angle),sin(angle),-sin(angle),cos(angle));
}

mat2 zoom(float scale){
	return mat2(scale,0,0,scale);
}


float drawbox(vec2 p,float w,float h){
	float b = smoothstep(w*0.5+0.001,w*0.5,abs(p.x));
	b *= smoothstep(h*0.5+0.001,h*0.5,abs(p.y));
	return b;
}
float drawTriangle(vec2 p1,vec2 p2,float w,vec2 uv){
	
	float k1 = (p1.y-p2.y)/((p1.x-w*.5)-p2.x);
	float k2 = (p1.y-p2.y)/((p1.x+w*.5)-p2.x);
	float k3 = (p1.y-(p1.y+.05))/((p1.x-w*.5)-(p1.x+w*.5));
	
	float b1 = (p1.y-k1*p1.x);
	float b2 = (p1.y-k2*(p1.x+w*.5));
	float b3 = (p1.y-k3*(p1.x-w*.5));
		
	float d1 = (k1*uv.x+b1-uv.y)/sqrt(k1*k1+1.);
	
	float d2 = (k2*(uv.x)+b2-uv.y)/sqrt(k2*k2+1.);
	float d3 = (k3*(uv.x)+b3-uv.y)/sqrt(k3*k3+1.);
	
	float d = step(0.,d1);
	d *= step(0.,d2);
	d *= step(d3,0.);
	
	//vec2 v1 = vec2(p1.x-w*.5,p1.y);
	//vec2 v2 = vec2(p1.x+w*.5,p1.y);
	//float dd = step(0.03,distance(uv,v1));
	//float ddd = step(0.03,distance(uv,v2));
	//float dddd = step(0.03,distance(uv,p2));
	//d = (dd*ddd*dddd);
	return d;
}

void main( void ) {
	
	vec2 uv = ( gl_FragCoord.xy *2.0- resolution.xy )/resolution.y ;
	vec3 col = vec3(1.);
	
	vec2 trans = vec2(0.1,0.1);
	float offx = 0.6;
	float offy = 0.5;
	vec2 p = uv-trans;
	vec2 p2 = uv-vec2(trans.x+offx,trans.y-offy);
	p*=rot(time)*zoom(1.);
	p2*=zoom(1.)*rot(time);
	
	float box = drawbox(p,0.1,0.1);
	
	float box2 = drawbox(p2+vec2(trans.x-offx*.5,trans.x+offy*.5),0.3,0.1);
	
	float triangle = drawTriangle(vec2(.3,.2),vec2(.2,.6),.6,uv);
	
	col*=(box+box2);

	float d = distance(uv,trans);
	float d2 = distance(uv,vec2(trans.x+offx,trans.y-offy));
	
	vec3 col2 = vec3(1.)*triangle;
	
	abs(uv.x)<=0.003?col=vec3(1.0):(abs(uv.y)<=0.003?col=vec3(1.0):col = col);
	d<=0.015?col=vec3(1.0,0.1,0.1):col = col;
	d2<=0.015?col=vec3(1.0,0.1,0.1):col = col;
	
	col += col2;
	gl_FragColor = vec4( col, 1.0 );

}