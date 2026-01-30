#ifdef GL_ES
precision mediump float;
#endif

// time
uniform float time;
// mouse position (pixel coordinates)
uniform vec2 mouse;
// screen resolution
uniform vec2 resolution;
// a sampler back to the previous frame
uniform sampler2D backbuffer;

#define DT (0.5)
#define K (0.01)

// we'll use r as the current position (.r - 0.5 is position),
// g as the current velocity (.g - 0.5 is the velocity)

void main( void ) {
	
	vec2 position = gl_FragCoord.xy / resolution;
	vec2 pixel = 1. / resolution;
	
	#define data(offset) (texture2D(backbuffer, position + pixel * offset))
	#define springPosition(offset) (data(offset).r - 0.5)
	#define springVelocity(offset) (data(offset).g - 0.5)
	#define springForce(offset) (data(offset).b - 0.5)
	
	float myPosition = springPosition(vec2(0., 0.));
	float myVelocity = springVelocity(vec2(0., 0.));
	float myAcceleration = springForce(vec2(0., 0.));
	
	if (myPosition == -0.5 && myVelocity == -0.5 && myAcceleration == -0.5) {
		gl_FragColor = vec4(0.5, 0.5, 0.5, 1);
	} else {
	
		float jerk = 0.;
		
		// take a look at my neighbors' position offsets and add a force to myself
		#define forceFor(offset) ((springPosition(offset) - myPosition)*K)
		jerk += forceFor(vec2(1., 0.));
		jerk += forceFor(vec2(-1., 0.));
		jerk += forceFor(vec2(0., 1.));
		jerk += forceFor(vec2(0., -1.));
		
		//euler integration
		myAcceleration += jerk * DT;
		myVelocity += myAcceleration * DT;
		myPosition += myVelocity * DT;
		
		vec4 state = vec4(myPosition + 0.5, myVelocity + 0.5, myAcceleration + 0.5, 1);
		
		if(length(mouse - position) < .01) {
			state = vec4(0.5, 0.5, 0.6, 1);
		}
		gl_FragColor = state;
	}

}