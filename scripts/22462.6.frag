//  				   _____ _       _____ _        __  __ ______ __  __  ____  _______     __
//  				  / ____| |     / ____| |      |  \/  |  ____|  \/  |/ __ \|  __ \ \   / /
// 				 | |  __| |    | (___ | |      | \  / | |__  | \  / | |  | | |__) \ \_/ / 
// 				 | | |_ | |     \___ \| |      | |\/| |  __| | |\/| | |  | |  _  / \   /  
//				 | |__| | |____ ____) | |____  | |  | | |____| |  | | |__| | | \ \  | |   
//				  \_____|______|_____/|______| |_|  |_|______|_|  |_|\____/|_|  \_\ |_|   
//
// This is a simple example of storing data in pixels. If you move the mouse towards the left of the screen, 
// the ball will go towards green, if you move it to the far right, it will go towards red, if at any point you move it
// to the middle, it will stay whatever colour it is. The colour is stored in the streak of blue on the far
// left.
// If you move your mouse to the top of the screen, the ball slows down, if you move the mouse to the bottom of
// the screen, the ball speeds up. This is stored in the streak of red on the far left.
// The ball position is store in the streak of purple on the far left. 
// Made by LIME :D
// Edits: - Ball follows mouse
//	  - Moving the circle over the red square will delete it!

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;


void main(void)
{
	//Retrieve data
	float colour = texture2D(backbuffer,( vec2(0.0,0.0) / resolution.xy )).a;
	float ballPositionX = texture2D(backbuffer,( vec2(1.0,0.0) / resolution.xy )).a;
	float ballPositionY = texture2D(backbuffer,( vec2(2.0,0.0) / resolution.xy )).a;
	float speed = texture2D(backbuffer,( vec2(3.0,0.0) / resolution.xy )).a;
	float varVal = texture2D(backbuffer,( gl_FragCoord.xy / resolution.xy)).a;
	
	//Quick and dirty fix - if this is removed, the initialization does not happen properly and the ball stays glued to the bottom left.
	if(ballPositionX == 0.0){ ballPositionX = 0.5; }
	if(ballPositionY == 0.0){ ballPositionY = 0.5; } 
	
	float mx = mouse.x;
	float my = mouse.y;
	
	if(gl_FragCoord.x <= 1.0){
		//Currently writing colour data
		if(mx <= 0.1){
			//Mouse at left of screen
			gl_FragColor = vec4(0.2, 0.0, 1.0, colour + 0.02 );
		}else if(mx >= 0.9){
			//Mouse at right of screen
			gl_FragColor = vec4(0.2, 0.0, 1.0, colour - 0.02 );
		}else{
			//Mouse neither at left nor right
			gl_FragColor = vec4(0.2, 0.0, 1.0, colour );
		}
	}else if(gl_FragCoord.x <= 2.0){
		//Currently writing position data
		float mouseDist = distance(mouse.xy, vec2(ballPositionX * resolution.x, ballPositionY * resolution.y));
		float mouseDiffX = (mouse.x - ballPositionX) / resolution.x;
		ballPositionX += (0.2*mouseDist) * mouseDiffX;
		gl_FragColor = vec4(1.0, 0.0, 1.0, ballPositionX);
	}else if(gl_FragCoord.x <= 3.0){
		//Currently writing position data
		float mouseDist = distance(mouse.xy, vec2(ballPositionX * resolution.x, ballPositionY * resolution.y));
		float mouseDiffY = (mouse.y - ballPositionY) / resolution.y;
		ballPositionY += (0.2*mouseDist) * mouseDiffY;
		gl_FragColor = vec4(1.0, 0.0, 1.0, ballPositionY);
	}else if(gl_FragCoord.x <= 4.0){
		//Currently writing speed data
		if(my <= 0.1){
			//Mouse at top of screen
			gl_FragColor = vec4(1.0, 0.0, 0.0, speed + 0.02 );
		}else if(my >= 0.9){
			//Mouse at bottom of screen
			gl_FragColor = vec4(1.0, 0.0, 0.0, speed - 0.02 );
		}else{
			//Mouse neither at top nor bottom
			gl_FragColor = vec4(1.0, 0.0, 0.0, speed );
		}
	}else{
		//Not writing data, drawing screen
		if(distance(gl_FragCoord.xy, vec2(ballPositionX * resolution.x, ballPositionY * resolution.y)) > 20.0){
			if(gl_FragCoord.x <= 0.1 * resolution.x){
				//Green band on the left
				gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0 );
			}
			if(gl_FragCoord.x >= 0.9 * resolution.x){
				//Red band on the right
				gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0 );
			}
			
			if(gl_FragCoord.x > 0.2 * resolution.x && gl_FragCoord.x < 0.8 * resolution.x &&
			   gl_FragCoord.y > 0.6 * resolution.y && gl_FragCoord.y < 0.8 * resolution.y){
				if(varVal < 1.0){
					if(varVal == 0.0){
						gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0 );
					}else{
						gl_FragColor = vec4(0.0, 0.0, 0.0, varVal );
					}
				}else{
					gl_FragColor = vec4(1.0 - colour, colour, 0.0, varVal );
				}
			}
			
			
		}else{
			//Circle! :D
			gl_FragColor = vec4(1.0 - colour, colour, 0.0, 0.2 );
		}
	}
}
