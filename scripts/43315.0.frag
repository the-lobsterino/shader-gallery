#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
#define ZOOM_FACTOR 0.10
#define LINE_DEV 50.0
#define REFRACTIVE_IDX (3./4.)
#define RAY_LENGTH 20.0

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

/**
 * Author: Kory(´・ω・`)
 */

float distanceVectorSegment(vec2 vector, vec2 segmentBegin, vec2 segmentEnd) {
    vec2 segment = segmentEnd - segmentBegin;
    vec2 relVector = vector - segmentBegin;

    float vDot = dot(relVector, segment);

    if(vDot >= dot(segment, segment)) {
        return length(relVector - segment);
    }

    if(vDot <= 0.0) {
        return length(relVector);
    }

    vec2 nSegment = normalize(segment);
    return length(relVector - nSegment * dot(relVector, nSegment));
}

float distanceToCircleAtOrigin(vec2 position, float radius) {
    return abs(length(position) - radius);
}

float getBrightnessFromDistance(float distance) {
    return pow(max(1.002-distance, 0.0), 500.);
}

void main( void ) {
    // screen initialization
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    vec2 screenCoord = surfacePosition / ZOOM_FACTOR;

    float minDist = distanceToCircleAtOrigin(screenCoord, 1.);

    float incidentInterval = 2.0 / (LINE_DEV - 1.0);
    for(int i = 0; i < int(LINE_DEV); i++) {
        float segY = -1. + incidentInterval * float(i);	
        float colX = sqrt(1.0 - segY * segY);
        vec2 incidence = vec2(colX, segY);

        // draw incident ray
        minDist = min(minDist, distanceVectorSegment(screenCoord, vec2(RAY_LENGTH, incidence.y), incidence));

        vec2 refractedRay = normalize(refract(vec2(-1.0, 0.0), normalize(incidence), REFRACTIVE_IDX));
        vec2 exitVec = incidence + 2.0 * refractedRay * dot(refractedRay, -incidence) * (1.0 - time/100.0);

        // draw internal ray
        minDist = min(minDist, distanceVectorSegment(screenCoord, incidence, exitVec));

        vec2 outRay = normalize(refract(-refractedRay, exitVec, 1.0 / REFRACTIVE_IDX));
        
        // draw outgoing ray
        minDist = min(minDist, distanceVectorSegment(screenCoord, exitVec, exitVec - outRay * (RAY_LENGTH + exitVec.x)));
    }

    gl_FragColor += vec4(vec3(getBrightnessFromDistance(minDist)), 0.0);
}