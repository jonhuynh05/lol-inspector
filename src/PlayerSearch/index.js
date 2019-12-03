import React from 'react'

const PlayerSearch = () => {
    return(
        <div>
            <form>
                <input type="text" name="player-query" />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default PlayerSearch