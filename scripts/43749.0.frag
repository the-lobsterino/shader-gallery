#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


//21.11.2017 
//18.10 

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy )/sin(time*0.1);

	vec3 COLOR = vec3(position.y+tan(time*0.1),position.y,position.x);
	/*    .
             .
            .
	   .
	  .
	 .
        .
          */
	float box_length = 0.02;
	                          //Speed
	float pointX = 0.4 + sin(time*1.5)*0.2;
	float pointY = 0.4 + sin(time*1.5)*0.2;
	
	//float pointX = mouse.x;
	//float pointY = mouse.y;
	
	//Box 1---------------
		if(position.x > pointX - box_length+sin(time*0.2)
		   && position.x < pointX + box_length
		   && position.y < pointX + box_length
		  && position.y > pointY - box_length)
		{
		        COLOR.x = 0.0;
			COLOR.y = 0.0;
			COLOR.z = 0.6;
		}
	
	
	float Xpoint= sin(time*0.1),Ypoint=sin(time*0.1);
	float Length_Box = 0.02;
	
	
	if(position.x > Ypoint -Length_Box && position.x < Xpoint+Length_Box &&
	   position.y > Ypoint -Length_Box && position.y < Ypoint+Length_Box )
	{
		COLOR.x = 0.0;
		COLOR.y = position.x;
	        COLOR.z = 0.0;
	}
	
	
	
	
	
	//Box 2--------------
	   
	/*float box_length2 = 0.02;
	
	float pointX2 = 0.5 + tan(time*1.5)*0.3;
	float pointY2 = 0.5 + tan(time*1.5)*1.3;
	
	if(position.x > pointX2 - box_length2
		   && position.x < pointX2 + box_length2
		   && position.y < pointX2 + box_length2
		  && position.y > pointY2 - box_length2)
		{
		        COLOR.x = 0.0;
			COLOR.y = 0.4;
			COLOR.z = 0.0;
		}
*/
	
             

	
	gl_FragColor = vec4(COLOR, 1.0 );

}