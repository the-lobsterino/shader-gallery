#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 mouseCoords = resolution * mouse;

struct Button{
	vec2 position;
	vec2 dimensions;
	vec4 color;
};

bool isInsideButton(Button button, vec2 i){
	if (i.x > button.position.x && i.y > button.position.y &&
	    i.x < (button.dimensions.x + button.position.x) && 
	    i.y < (button.dimensions.y + button.position.y)){
		return true;
	} else {return false;}
}

void drawButton(Button button){
	vec4 buttonFill = button.color;
	
	if(isInsideButton(button, mouseCoords)){
		buttonFill.x = 0.5;
	} else {
		buttonFill = button.color;
	}
	
	if(isInsideButton(button, gl_FragCoord.xy)){
		gl_FragColor = buttonFill;
	}
}

void main( void ) {
	
	gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);

	Button button1 = Button(vec2(200, 250), vec2(100, 25), vec4(1.0, 1.0, 0.0, 0.0));
	drawButton(button1);

}