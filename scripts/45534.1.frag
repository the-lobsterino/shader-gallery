// Author: Prince Polka
// Title: Dancing Pixels
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D texture;
mat3 R1, R2;

// this is dumb loop because R2[Y][X] gives error
float getmatrixvalue(int Y, int X){
for(int y=0;y<3;y++){
for(int x=0;x<3;x++){
	if(y==Y && x==X){
return R2[y][x];
}}}
	
return 0.0;
}

void main() {
    vec2 st = gl_FragCoord.xy / resolution.xy;
    vec2 pitch = 1.0 / resolution.xy;
    vec2 ist = vec2(st);
    // store two mat3's for the values so we can modify R1 and preserve the orignal values in R2
    R1 = R2 = mat3(
    texture2D(texture, ist + pitch*vec2(-1,-1)).r,
    texture2D(texture, ist + pitch*vec2( 0,-1)).r,
    texture2D(texture, ist + pitch*vec2( 1,-1)).r,
    texture2D(texture, ist + pitch*vec2(-1, 0)).r,
    texture2D(texture,ist).r,
    texture2D(texture, ist + pitch*vec2( 1, 0)).r,
    texture2D(texture, ist + pitch*vec2(-1, 1)).r,
    texture2D(texture, ist + pitch*vec2( 0, 1)).r,
    texture2D(texture, ist + pitch*vec2( 1, 1)).r
    );


    float myred = R2[1][1];

    R1[0] = step(myred,R2[0]); // set R1 values to 0.0 if lower than mine , otherwise 1.0
    R1[1] = step(myred,R2[1]);
    R1[2] = step(myred,R2[2]);

    vec3 one = vec3(1.0,1.0,1.0);
    int N = int( mod(dot( R1 * one , one )+floor(time*0.3),8.0) );  // sum up N number of reds higher than mine

    float paintFlag = clamp( (2.0 - length(st-mouse)*20.0 ) ,0.0,1.0);
	

    gl_FragColor = vec4(vec3(mix( getmatrixvalue(N/3, int( mod( float(N),3.0) ) ), abs(fract(time)-0.5)*2.0, paintFlag )),1.0);
}
