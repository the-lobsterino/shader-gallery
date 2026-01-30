#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

const float pi = 3.14159265358979;
#define rotate2d(A) mat2(cos(A), sin(A), -sin(A), cos(A))
// `normalized arctangent`
#define natan(Z) (atan(Z.x, Z.y)+pi)/(2.*pi)

vec2 p;
bool brexit = false;



void midpoint(){
	if(length(p) < 0.01) gl_FragColor = vec4(1,natan(p),0,1);
}

void f_2(){
	const float line_width = 0.003;
	float line_span = .69-line_width/2.;
	if(abs(p.y) < line_width && abs(p.x) < line_span){
		gl_FragColor = 1.-gl_FragColor;
	}
	float theta = -3.14159/2.*sign(p.x);
	p.x -= line_span*sign(p.x);
	p *= rotate2d(theta)/line_span;
}

void f_3(){
	const float tri_width = 1.;
	const float tri_height = tri_width*sqrt(3.)/2.;
	if(p.y > -tri_height/3. && p.y < tri_height*2./3.-abs(p.x*sqrt(3.))){
		gl_FragColor = 1.-gl_FragColor;
	}
	float at = natan(p);
	float theta = 0.;
	if(at < 1./3.){
		p.y += tri_height/3.;
		p.x += tri_width/2.;
		theta = pi*2./3.;
	}else if(at < 2./3.){
		p.y -= tri_height*2./3.;
		theta = 0.;
	}else{
		p.y += tri_height/3.;
		p.x -= tri_width/2.;
		theta = -pi*2./3.;
	}
	p *= rotate2d(theta);
	p /= tri_width;
}

void branch(){
	float branch_width = 0.02 + 0.03*abs(p.y-.5);
	const float branch_height = 0.20;
	const vec4 branch_color = vec4(.4,.3,.2,1);
	float branch_turn = (0.123456)*pi;
	float branch_scale = 2./3.;
	
	if(abs(p.x) < branch_width && abs(p.y) < branch_height){
		gl_FragColor = branch_color;
	}
	
	p += vec2(0.0,-branch_height);
	p *= rotate2d(branch_turn*-sign(p.x));
	p /= branch_scale*vec2(sign(p.x)*1.,1.1);
	p += vec2(0.0,-branch_height);
}
void leaf(){
	vec4 leaf_color = vec4(0,1,0,1);
	if(length(p) < 0.1){
		gl_FragColor = leaf_color;
		brexit = true;
	}
}

void main( void ) {
	gl_FragColor = vec4( 1.0 );
	brexit = false;
	p = surfacePosition*2.+vec2(0.0,0.5);
	branch();
	branch();
	for(float i = 0.; i <= 1.; i += 1./5.){
		midpoint();
		branch();
		leaf();
		if(brexit) return;
	}
}