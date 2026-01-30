#version 120
void main(){
	gl_frontColor=gl_Color;
	gl_backColor=gl_Color;
	gl_Position=gl_ModelViewProjectionMatrix*gl_vertex;
}