#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float nudge = 0.739513+cos(time*0.0095);    // size of perpendicular vector
float normalizer = 1.0 / sqrt(1.0 + nudge*nudge);    // pythagorean theorem on that perpendicular to maintain scale
float SpiralNoiseC(vec3 p){
    float n = 0.0;    // noise amount
    float iter = 1.0;
    for (int i = 0; i < 6; i++){
        // add sin and cos scaled inverse with the frequency
        n += -abs(sin(p.y*iter) + cos(p.x*iter)) / iter;    // abs for a ridged look
        // rotate by adding perpendicular and scaling down
        p.xy += vec2(p.y, -p.x) * nudge;
        p.xy *= normalizer;
        // rotate on other axis
        p.xz += vec2(p.z, -p.x) * nudge;
        p.xz *= normalizer;
        // increase the frequency
        iter *= 1.933733;
    }
    return n;
}

float SpiralNoise3D(vec3 p){
    float n = 0.0;
    float iter = 1.0;
    for (int i = 0; i < 5; i++){
        n += (sin(p.y*iter) + cos(p.x*iter)) / iter;
        p.xz += vec2(p.z, -p.x) * nudge;
        p.xz *= normalizer;
        iter *= 1.33733;
    }
    return n;
}

float NebulaNoise(vec3 p){
   float final = p.y + 4.5;
    final -= SpiralNoiseC(p.xyz); // mid-range noise
    final += SpiralNoiseC(p.zxy*0.1123 + 50.0)*4.0; // large scale features
    final -= SpiralNoise3D(p); // more large scale features, but 3d

    return final;
}


void main( void ) {

	vec2 pos=(gl_FragCoord.xy/resolution.xy)*2.0-1.0;
	pos.x*=resolution.x/resolution.y;
	
	
	pos*=vec2(4.0);
	
	
	float col=0.2;
	
	col=NebulaNoise(vec3(pos,1.0));
	
	
	col=1.0/col;
	
	
	
	
	vec3 color=vec3(col, 0.2*col*col*col, 0.79*col*col*col*col*col);
	
	
	gl_FragColor=vec4(color, 1.0);

}