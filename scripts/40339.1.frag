


precision mediump float;
uniform float time;
uniform vec2 resolution;
void main( void ) {
    vec2 position = ( gl_FragCoord.xy / resolution.xy ) - 0.40;
    //
    float amplitude = .1;
    float frequency = 9.5;
    
    float waves = sin(position.x * frequency);
    float t = 0.01*(-time*100.0);
    waves += sin(position.x*frequency*2.1 + t)*4.5;
    waves += sin(position.x*frequency*1.72 + t*1.221)*4.0;
    waves += sin(position.x*frequency*2.221 + t*0.437)*5.0;
    waves += sin(position.x*frequency*3.1122+ t*4.269)*2.5;
    waves *= amplitude*0.09;

    float color = position.y  < waves ?(waves-position.y)*2.0 : 0.0;
    color = min(pow(color,0.5),0.5);
    gl_FragColor = vec4( position.y < waves ? vec3(0.1,0.01,1.0)
                                               
                        : vec3(0.1,0.3,1.0), 1.0 );
}
