#ifdef GL_ES
precision lowp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat2 CCW = mat2(0,1,-1,0);

mat2 rotmat(float theta){
	return mat2(cos(theta),sin(theta),-sin(theta),cos(theta)); 
}
vec2 rotate( vec2 v, float theta){
	return v * rotmat(theta);
}
bool initialize = true;
const int glen = 5;
float offset = .5230987012345;
	float scale[glen];
	float colors[glen];
void init(void){
	for (int i=0; i<10; i++){
		scale[i] = mouse.y*80.0;
	}
}
void main( void ) {
        if ( initialize ){
		initialize = false;
		init();
	}
	float scale = 10.0+10.0;
	const int len = glen;
	//float len = length(mouse);
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float color = 0.0;
	float flen = float(len)+offset;
	//colors[2] += cos(scale[2]* rotate(position, 3.14159/8.0).y+time);
	for(int i = 0; i<len; i++){
		colors[i] = cos(scale*(rotate(position,float(i)*2.0*3.14159/flen)+resolution.xy).y+time);
		color += colors[i];}
		
	//color = .5*(colors[2]+colors[2]);
	//color = colors[1];
	float mcolor = distance(position,mouse);
	mcolor = 1.0/(pow(mcolor,.9));
	float ocolor = distance(position, vec2(0.0,0.0));
        vec3 color3 = vec3(color,color,color);
	vec3 mcolor3 = vec3(mcolor)*vec3(.3,.4,.5);
	mcolor3 = vec3(0.0);
	
	
	gl_FragColor = vec4( color3-2.0*ocolor+mcolor3, 1.0 );

}