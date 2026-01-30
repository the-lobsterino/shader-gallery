#ifdef GL_ES
precision mediump float;
#endif

/*
	Simple Game of Life shader
	Second AsuMagic's shader (remember the grahing one?)

	Put the mouse on the left of the screen to generate some randomness
	And leave the mouse on the right to see your cells animating!

	I believe there's some randomness when cells are close to a border, however it's still perfectly working.

	Watch little ships destroying some static cells!
*/

/*
	Game of life rules are very simple.

	A cell is either dead either alive.
	If a cell is dead, and there are exactly 3 neighbour cells, the cell will be alive next iteration
	If a cell is dead, it needs either 2 either 3 neighbour cells to survive, else it dies next iteration
*/

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D back;

// This defines the chances of having a cell dead at the current position alive when randomizing.
#define RANDOM_PERCENTAGE 0.2

// Some defines to make our life easier
#define pixel    vec2(1./resolution.x, 1./resolution.y) // The size of a pixel
#define position vec2(gl_FragCoord.xy / resolution.xy)  // And the current pixel position (not normalized)

float rand(vec2 co)
{
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

/* This function returns the amount of nearby cells to a position */
float getNearbySummary(vec2 pos)
{
	return	texture2D(back, position + vec2(-pixel.x, -pixel.y)).r + // Top left
		texture2D(back, position + vec2(-pixel.x, 0.)).r +	 // Center left
		texture2D(back, position + vec2(-pixel.x, pixel.y)).r +	 // Bottom left
			
		texture2D(back, position + vec2(0., -pixel.y)).r +	 // Top middle
		texture2D(back, position + vec2(0., pixel.y)).r +	 // Bottom middle
			
		texture2D(back, position + vec2(pixel.x, -pixel.y)).r +  // Top right
		texture2D(back, position + vec2(pixel.x, 0.)).r +	 // Center right
		texture2D(back, position + vec2(pixel.x, pixel.y)).r;	 // Bottom right
}

void main(void)
{
	if (mouse.x < 0.05) // If the mouse is close to the left, let's make some randomness
	{
		gl_FragColor.rgb = vec3(rand(position * vec2(floor(time / 1.05))) > RANDOM_PERCENTAGE);
	}
	else
	{
		// Testing the backbuffer - Leave it uncommented, but you can have some fun with it uncommenting it and recommenting it after then
		//gl_FragColor.rgb = texture2D(back, position - vec2(0, pixel.y)).rgb;
		
		float nearsum = getNearbySummary(position);		
		bool isAlive = texture2D(back, position).r  == 1.0; // We check if our current cell is alive so we know what to do then
		
		if (!isAlive)
		{
			if (nearsum == 3.)
			{
				gl_FragColor.rgb = vec3(1.); // Let's let this cell live next time!
			}
		}
		else
		{
			if ((nearsum == 2.) || (nearsum == 3.))
			{
				gl_FragColor.rgb = vec3(1.); // We keep this cell alive - we don't need to say the cell is dead otherwise because gl_FragColor will be set to 0 by default and so its previous color
			}
		}
	}
	
	// I have seen this sometimes is required, so there we go
	gl_FragColor.a = 1.0;
}